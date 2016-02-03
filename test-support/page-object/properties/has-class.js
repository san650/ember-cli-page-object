import Ember from 'ember';
import { findElementWithAssert, every } from '../helpers';

/**
 * Creates a predicate to validate if an element has a given CSS class
 *
 * @example
 *
 *   var page = PageObject.create({
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
export function hasClass(cssClass, selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let elements = findElementWithAssert(this, selector, options);

      return every(elements, function(element) {
        return element.hasClass(cssClass);
      });
    }
  };
}
