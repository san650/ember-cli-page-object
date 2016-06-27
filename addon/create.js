import Ceibo from 'ceibo';
import { text } from './queries/text';
import { isVisible } from './predicates/is-visible';
import { isHidden } from './predicates/is-hidden';
import { contains } from './predicates/contains';
import { clickOnText } from './actions/click-on-text';
import { clickable } from './-private/properties/clickable';
import { render, setContext, removeContext } from './context';
import { assign } from './helpers';

const thenDescriptor = {
  isDescriptor: true,
  value() {
    /* global wait */
    return wait().then(...arguments);
  }
};

const defaultProperties = {
  contains,
  isHidden,
  isVisible,
  text,
  clickOn: clickOnText,
  click: clickable,
  then: thenDescriptor
};

function plugDefaultProperties(definition) {
  Object.keys(defaultProperties).forEach((key) => {
    if (typeof (definition[key]) !== 'undefined') {
      return;
    }

    if (typeof (defaultProperties[key]) === 'function') {
      definition[key] = defaultProperties[key]();
    } else {
      definition[key] = defaultProperties[key];
    }
  });
}

// See https://github.com/san650/ceibo#examples for more info on how Ceibo
// builders work.
function buildObject(node, blueprintKey, blueprint, defaultBuilder) {
  blueprint = assign({}, blueprint);
  plugDefaultProperties(blueprint);

  return defaultBuilder(node, blueprintKey, blueprint, defaultBuilder);
}

/**
 * Creates a new PageObject.
 *
 * By default, the resulting PageObject will respond to:
 *
 * - **Actions**: click, clickOn
 * - **Predicates**: contains, isHidden, isVisible
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
 * import PageObject, { text } from 'ember-cli-page-object';
 *
 * const page = PageObject.create({
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
 * const page = PageObject.create({
 *   scope: '#my-page'
 * });
 *
 * assert.equal(page.text, 'My super text');
 * assert.ok(page.contains('super'));
 * assert.ok(page.isVisible);
 * assert.notOk(page.isHidden);
 *
 * // clicks div#my-page
 * page.click();
 *
 * // clicks button
 * page.clickOn('Press Me');
 *
 * @public
 *
 * @param {Object} definition - PageObject definition
 * @param {Object} [definition.context] - A test's `this` context
 * @param {Object} options - [private] Ceibo options. Do not use!
 * @return {PageObject}
 */
export function create(definition, options = {}) {
  definition = assign({}, definition);
  let { context } = definition;
  delete definition.context;

  let builder = {
    object: buildObject
  };

  let page = Ceibo.create(definition, assign({ builder }, options));

  if (page) {
    page.render = render;
    page.setContext = setContext;
    page.removeContext = removeContext;

    page.setContext(context);
  }

  return page;
}
