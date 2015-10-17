import Descriptor from '../descriptor';
import { findElement } from '../helpers';

/**
 * Gets the count of matched elements
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {string} value of the attribute
 */
function getCount(target, key, options) {
  let element = findElement(options, target);

  return element.length;
}

/**
 * Creates a predicate to get the count of matched elements
 *
 * @example
 *
 *   var page = PageObject.create({
 *     imageCount: count('.img')
 *   });
 *
 *   assert.equal(page.imageCount(), 2);
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function count(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(getCount, options);
}
