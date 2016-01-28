import Ember from 'ember';
import Ceibo from 'ceibo';
import { text } from './properties/text';
import { isVisible } from './properties/is-visible';
import { isHidden } from './properties/is-hidden';
import { clickOnText } from './properties/click-on-text';
import { clickable } from './properties/clickable';
import { contains } from './properties/contains';

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
 * @example
 *
 *   var page = PageObject.create({
 *     title: text('.title')
 *   });
 *
 *   assert.equal(page.title, 'Dummy title');
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
