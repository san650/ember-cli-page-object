import Ember from 'ember';
import Ceibo from 'ceibo';
import { text } from './queries/text';
import { isVisible } from './predicates/is-visible';
import { isHidden } from './predicates/is-hidden';
import { contains } from './predicates/contains';
import { clickOnText } from './actions/click-on-text';
import { clickable } from './actions/clickable';

var { merge } = Ember;

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
}

/**
 * See https://github.com/san650/ceibo#examples for more info on how Ceibo
 * builders work.
 */
function buildObject(builder, target, key, definition) {
  var container = {};

  plugDefaultProperties(definition);

  // Create child component
  Ceibo.defineProperty(target, key, container);

  // Recursion
  builder.processNode(definition, container, target);
}

/**
 * Creates a new PageObject
 *
 * By default, the result PageObject will respond to a default set of options: click, clickOn,
 * contains, isHidden, isVisible and text.
 *
 * @example
 *
 * // <div class="title">My title</div>
 *
 * var page = PageObject.create({
 *   title: PageObject.text('.title')
 * });
 *
 * assert.equal(page.title, 'My title');
 *
 * @example
 *
 * // <div id="my-page">
 * //  My super text
 * //  <button> Press Me</button>
 * // </div>
 *
 * var page = PageObject.create({
 *   scope: '#my-page',
 * });
 *
 * assert.equal(page.text, 'My super text');
 * assert.ok(page.isVisible);
 * assert.ok(!page.isHidden);
 * assert.ok(page.contains('super'));
 *
 * // clicks div#my-page
 * page.click
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
