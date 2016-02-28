import Ember from 'ember';
import Ceibo from 'ceibo';
import { text } from './queries/text';
import { isVisible } from './predicates/is-visible';
import { isHidden } from './predicates/is-hidden';
import { contains } from './predicates/contains';
import { clickOnText } from './actions/click-on-text';
import { clickable } from './actions/clickable';

var { merge } = Ember;

var thenDescriptor = {
  isDescriptor: true,
  value() {
    /* global wait */
    return wait().then(...arguments);
  }
};

function plugDefaultProperties(definition) {
  if (typeof(definition.isVisible) === 'undefined') {
    definition.isVisible = isVisible();
  }

  if (typeof(definition.isHidden) === 'undefined') {
    definition.isHidden = isHidden();
  }

  if (typeof(definition.clickOn) === 'undefined') {
    definition.clickOn = clickOnText();
  }

  if (typeof(definition.click) === 'undefined') {
    definition.click = clickable();
  }

  if (typeof(definition.contains) === 'undefined') {
    definition.contains = contains();
  }

  if (typeof(definition.text) === 'undefined') {
    definition.text = text();
  }

  if (typeof(definition.then) === 'undefined') {
    definition.then = thenDescriptor;
  }
}

// See https://github.com/san650/ceibo#examples for more info on how Ceibo
// builders work.
function buildObject(builder, target, key, definition) {
  var container = {};

  plugDefaultProperties(definition);

  // Create child component
  Ceibo.defineProperty(target, key, container);

  // Recursion
  builder.processNode(definition, container, target);
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
 * @param {Object} options - [private] Ceibo options. Do not use!
 * @return {PageObject}
 */
export function create(definition, options = {}) {
  var builder = {
    object: buildObject
  };

  return Ceibo.create(definition, merge({ builder }, options ));
}
