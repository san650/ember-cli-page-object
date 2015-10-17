import Descriptor from '../descriptor';
import { findElementWithAssert } from '../helpers';

/**
 * Checks if an element is visible
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Boolean} true if the element is visible
 */
function doIsVisible(target, key, options) {
  let element = findElementWithAssert(options, target);

  return element.is(':visible');
}

/**
 * Creates a predicate to validate if an element is visible
 *
 * @example
 *
 *   var page = PageObject.create({
 *     isImageVisible: isVisible('.img')
 *   });
 *
 *   assert.ok(page.isImageVisible(), 'Image is visible');
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function isVisible(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(doIsVisible, options);
}
