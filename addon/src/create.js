import Ceibo from '@ro0gr/ceibo';
import {
  getPageObjectDefinition,
  isPageObject,
  storePageObjectDefinition,
} from './-private/meta';
import dsl from './-private/dsl';
import { getter } from './macros/index';
import { assignDescriptors } from './-private/helpers';

//
// When running RFC268 tests, we have to play some tricks to support chaining.
// RFC268 helpers don't wait for things to settle by defaut, but return a
// promise that will resolve when everything settles. So this means
//
// page.clickOn('.foo');
// page.clickOn('.bar');
//
// will not wait after either of the clicks, whereas
//
// await page.clickOn('.foo');
// await page.clickOn('.bar');
//
// will wait after each of them. However, to preserve chaining behavior,
//
// page
//   .clickOn('.foo')
//   .clickOn('.bar');
//
// would need to wait between the clicks. However, if `clickOn()` just returned
// `page` this would be impossible because then it would be exactly the same as
// the first example, which must not wait between clicks.
//
// So the solution is to return something other than `page` from,
// `page.clickOn('.foo')`, but something that behaves just like `page` except
// waits for things to settle before invoking any async methods.
//
// To accomplish this, when building our Ceibo tree, we build a mirror copy of
// it (the "chained tree"). Anytime a chainable method is invoked, instead of
// returning the node whose method was invoked, we can return its mirror node in
// the chained tree. Then, anytime an async method is invoked on that node
// (meaning we are in a chaining scenario), the execution context can recognize
// it as a chained node and wait before invoking the target method.
//

// See https://github.com/san650/ceibo#examples for more info on how Ceibo
// builders work.

// This builder builds the primary tree
function buildObject(node, blueprintKey, blueprint, defaultBuilder) {
  let definition;

  // Preserve plain arrays, prevent `Error: string values are not supported in page object definitions Key: "0"` error
  if (Array.isArray(blueprint)) {
    node[blueprintKey] = blueprint;
    return;
  }

  // to allow page objects to exist in definitions, we store the definition that
  // created the page object, allowing us to substitute a page object with its
  // definition during creation
  if (isPageObject(blueprint)) {
    definition = getPageObjectDefinition(blueprint);
  } else {
    Object.getOwnPropertyNames(blueprint).forEach((key) => {
      const { get, value } = Object.getOwnPropertyDescriptor(blueprint, key);

      if (typeof get === 'function') {
        Object.defineProperty(blueprint, key, {
          value: getter(get),
        });
      } else if (
        typeof value === 'string' &&
        !['scope', 'testContainer'].includes(key)
      ) {
        throw new Error(
          `string values are not supported in page object definitions

Key: "${key}"`
        );
      }
    });

    definition = blueprint;
  }

  let blueprintToStore = { ...definition };
  //the _chainedTree is an implementation detail that shouldn't make it into the stored
  if (blueprintToStore._chainedTree) {
    delete blueprintToStore._chainedTree;
  }
  blueprint = {
    ...dsl,
    ...definition,
  };

  const [instance, blueprintToApply] = defaultBuilder(
    node,
    blueprintKey,
    blueprint,
    defaultBuilder
  );

  // persist definition once we have an instance
  storePageObjectDefinition(instance, blueprintToStore);

  return [instance, blueprintToApply];
}

/**
 * Creates a new PageObject.
 *
 * By default, the resulting PageObject will respond to:
 *
 * - **Actions**: click, clickOn, fillIn, select
 * - **Predicates**: contains, isHidden, isPresent, isVisible
 * - **Queries**: text
 *
 * `definition` can include a key `context`, which is an
 * optional integration test `this` context.
 *
 * If a context is passed, it is used by actions, queries, etc.,
 * as the `this` in `this.$()`.
 *
 * If no context is passed, the global Ember acceptence test
 * helpers are used.
 *
 * @example
 *
 * // <div class="title">My title</div>
 *
 * import { create, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   title: text('.title')
 * });
 *
 * assert.equal(page.title, 'My title');
 *
 * @example
 *
 * // <div id="my-page">
 * //   My super text
 * //   <button>Press Me</button>
 * // </div>
 *
 * const page = create({
 *   scope: '#my-page'
 * });
 *
 * assert.equal(page.text, 'My super text');
 * assert.ok(page.contains('super'));
 * assert.ok(page.isPresent);
 * assert.ok(page.isVisible);
 * assert.notOk(page.isHidden);
 * assert.equal(page.value, 'my input value');
 *
 * // clicks div#my-page
 * page.click();
 *
 * // clicks button
 * page.clickOn('Press Me');
 *
 * // fills an input
 * page.fillIn('name', 'John Doe');
 *
 * // selects an option
 * page.select('country', 'Uruguay');
 *
 * @public
 *
 * @param {Object} definition - PageObject definition
 * @param {Object} [definition.context] - A test's `this` context
 * @param {Object} options - [private] Ceibo options. Do not use!
 * @return {PageObject}
 */
export function create(definition = {}, options = {}) {
  if (typeof definition === 'string') {
    throw new Error('Definition can not be a string');
  }

  // in the instance where the definition is a page object, we must use the stored definition directly
  // or else we will fire off the Ceibo created getters which will error
  definition = isPageObject(definition)
    ? { ...getPageObjectDefinition(definition) }
    : assignDescriptors({}, definition);

  if (definition.context) {
    // this is supposed to prevent an infinite recursion, for users who has not migrated
    // from the ModuleForComponent tests yet.
    // @todo: cover by test
    throw new Error(
      '"context" key is not allowed to be passed at definition root.'
    );
  }

  // Build the chained tree
  let chainedBuilder = {
    object: buildObject,
  };
  let chainedTree = Ceibo.create(definition, {
    builder: chainedBuilder,
    ...options,
  });

  // Attach it to the root in the definition of the primary tree
  definition._chainedTree = getter(function () {
    return chainedTree;
  });

  // Build the primary tree
  let builder = {
    object: buildObject,
  };

  return Ceibo.create(definition, {
    builder,
    ...options,
  });
}
