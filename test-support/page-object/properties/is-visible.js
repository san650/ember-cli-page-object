import Ember from 'ember';
import { findElement } from '../helpers';

/**
 * Creates a predicate to validate if an element is visible
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
export function isVisible(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let element = findElement(this, selector, options),
        result;

      if (element.length > 0) {
        result = !(Ember.A(element).any(function(e) {
          return $(e).is(':hidden')
        }));
      } else {
        result = false
      }

      return result;
    }
  };
}
