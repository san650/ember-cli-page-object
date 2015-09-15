/* global findWithAssert */

import Descriptor from '../descriptor';
import { qualifySelector } from '../helpers';

/**
 * Checks if an element has the CSS class name
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} selector - CSS selector of the element to check
 * @param {string} options.cssClass - Name of the CSS class to look for
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Boolean} true if the element has the CSS class
 */
function doHasClass(target, key, options) {
  let selector = qualifySelector(options.scope || target.scope, options.selector),
      element = findWithAssert(selector);

  return element.hasClass(options.cssClass);
}

/**
 * Creates a predicate to validate if an element has a given CSS class
 *
 * @example
 *
 *   var page = PageObject.build({
 *     isImageActive: hasClass('is-active', '.img')
 *   });
 *
 *   assert.ok(page.isImageActive(), 'Image is active');
 *
 * @param {string} cssClass - Name of the CSS class to look for
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function hasClass(cssClass, selector, options = {}) {
  options.cssClass = cssClass;
  options.selector = selector;

  return new Descriptor(doHasClass, options);
}
