import { findElement, every } from '../helpers';

/**
 * Creates a predicate to validate if an element is hidden
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
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export function isHidden(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let elements = findElement(this, selector, options);

      return every(elements, function(element) {
        return element.is(':hidden');
      });
    }
  };
}
