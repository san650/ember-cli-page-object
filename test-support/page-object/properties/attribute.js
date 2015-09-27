import Descriptor from '../descriptor';
import { findElementWithAssert } from '../helpers';

/**
 * Gets the value of an attribute from an element
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} selector - CSS selector of the element to check
 * @param {string} options.attributeName - Name of the attribute to get
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {string} value of the attribute
 */
function getAttribute(target, key, options) {
  let element = findElementWithAssert(options, target);

  return element.attr(options.attributeName);
}

/**
 * Creates a predicate to get an attribute of an element
 *
 * @example
 *
 *   var page = PageObject.build({
 *     imageAlternateText: attribute('alt', '.img')
 *   });
 *
 *   assert.equal(page.imageAlternateText(), 'Logo');
 *
 * @param {string} attributeName - Name of the attribute to get
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function hasClass(attributeName, selector, options = {}) {
  options.attributeName = attributeName;
  options.selector = selector;

  return new Descriptor(getAttribute, options);
}
