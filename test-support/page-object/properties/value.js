import Descriptor from '../descriptor';
import { findElementWithAssert, trim } from '../helpers';

/**
 * Gets the value of the matched element
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {string} value of the element
 */
function getValue(target, key, options) {
  let element = findElementWithAssert(options, target);

  return trim(element.val());
}

/**
 * Creates a predicate to get the value of the matched element
 *
 * @example
 *
 *   var page = PageObject.build({
 *     name: value('#name')
 *   });
 *
 *   assert.equal(page.name(), 'John Doe');
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function text(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(getValue, options);
}
