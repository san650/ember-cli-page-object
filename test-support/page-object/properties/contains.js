import Descriptor from '../descriptor';
import { findElementWithAssert } from '../helpers';

/**
 * Checks if an element has a subtext
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} options.selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @param {number} textToSearch - Text to search
 * @return {Boolean} true if the element has a subtext
 */
function doContains(target, key, options, textToSearch) {
  let element = findElementWithAssert(options, target);

  return element.text().indexOf(textToSearch) >= 0;
}

/**
 * Creates a predicate to validate if an element contains a subtext
 *
 * @example
 *   <h1> Page Title </h1>
 *
 *   var page = PageObject.create({
 *     titleIncludes: contains('h1')
 *   });
 *
 *   assert.ok(page.titleIncludes('Page'));
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function contains(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(doContains, options);
}
