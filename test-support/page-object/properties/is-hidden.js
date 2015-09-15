import Descriptor from '../descriptor';
import { findElement } from '../helpers';

/**
 * Checks if an element is hidden
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Boolean} true if the element is hidden
 */
function doIsHidden(target, key, options) {
  let element = findElement(options, target);

  return (element.length > 0) ? element.is(':hidden') : true;
}

/**
 * Creates a predicate to validate if an element is hidden
 *
 * @example
 *
 *   var page = PageObject.build({
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
export default function isHidden(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(doIsHidden, options);
}
