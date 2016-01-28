import { findElement } from '../helpers';

/**
 * Gets the count of matched elements
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
 * @param {string} options.scope - Add scope
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function count(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findElement(this, selector, options).length;
    }
  };
}
