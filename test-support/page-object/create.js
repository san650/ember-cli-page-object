import Ember from 'ember';
import Ceibo from 'ceibo';
import { text } from './queries/text';
import { isVisible } from './predicates/is-visible';
import { isHidden } from './predicates/is-hidden';
import { contains } from './predicates/contains';
import { clickOnText } from './actions/click-on-text';
import { clickable } from './actions/clickable';
import { bindContextMethods } from './context';

const { merge } = Ember;

var thenDescriptor = {
  isDescriptor: true,
  value() {
    /* global wait */
    return wait().then(...arguments);
  }
};

var defaultProperties = {
  isVisible: isVisible,
  isHidden: isHidden,
  clickOn: clickOnText,
  click: clickable,
  contains: contains,
  text: text,
  then: thenDescriptor
};

function plugDefaultProperties(definition) {
  Object.keys(defaultProperties).forEach(key => {
    if (typeof(definition[key]) !== 'undefined') {
      return;
    }

    if (typeof(defaultProperties[key]) === 'function') {
      definition[key] = defaultProperties[key]();
    } else {
      definition[key] = defaultProperties[key];
    }
  });
}

// See https://github.com/san650/ceibo#examples for more info on how Ceibo
// builders work.
function buildObject(builder, target, key, definition) {
  // Don't process the test's `this` context with
  // Ceibo. Because some values in the test's `this` are
  // circular references, it gets stuck in an infinite loop.
  if (key !== 'context') {
    plugDefaultProperties(definition);

    // Call the default object builder
    Ceibo.defaults.builder.object(builder, target, key, definition);
  }
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
 * import PageObject, { text } from 'frontend/tests/page-object';
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
 * @param {Object} definition.context - A test's `this` context
 * @param {Object} options - [private] Ceibo options. Do not use!
 * @return {PageObject}
 */
export function create(definition, options = {}) {
  const context = typeof definition === 'object' ? definition.context : null;
  const builder = {
    object: buildObject
  };
  const page = Ceibo.create(definition, merge({ builder }, options));

  if (page) {
    bindContextMethods(page);

    page.setContext(context);
  }

  return page;
}
