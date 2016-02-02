import Ember from 'ember';
import { findElementWithAssert } from '../helpers';

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
      let element = findElementWithAssert(this, selector, options);

      return !(Ember.A(element).any(function(e) {
        return !$(e).hasClass(cssClass);
      }));
    }
  };
}
