import Descriptor from '../descriptor';
import { findElementWithAssert } from '../helpers';

/**
 * Checks if an element doesn't have the CSS class name
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} options.selector - CSS selector of the container of the element to click
 * @param {string} options.cssClass - Name of the CSS class to look for
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Boolean} true if the element doesn't have the CSS class
 */
function doNotHasClass(target, key, options) {
  let element = findElementWithAssert(options, target);

  return !element.hasClass(options.cssClass);
}

/**
 * Creates a predicate to validate if an element doesn't have a given CSS class
 *
 * @example
 *
 *   var page = PageObject.create({
 *     isImageDeactivated: notHasClass('is-active', '.img')
 *   });
 *
 *   assert.ok(page.isImageDeactivated(), 'Image is not active');
 *
 * @param {string} cssClass - Name of the CSS class to look for
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function notHasClass(cssClass, selector, options = {}) {
  options.cssClass = cssClass;
  options.selector = selector;

  return new Descriptor(doNotHasClass, options);
}
