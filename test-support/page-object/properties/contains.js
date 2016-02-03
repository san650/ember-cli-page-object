import { findElementWithAssert, every } from '../helpers';

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
export function contains(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToSearch) {
      let elements = findElementWithAssert(this, selector, options);

      return every(elements, function(element) {
        return element.text().indexOf(textToSearch) >= 0
      });
    }
  };
}
