import { findElementWithAssert } from '../helpers';

/**
 * Gets the value of an attribute from an element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     imageAlternateText: attribute('alt', '.img')
 *   });
 *
 *   assert.equal(page.imageAlternateText, 'Logo');
 *
 * @param {string} attributeName - Name of the attribute to get
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export function attribute(attributeName, selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var element = findElementWithAssert(this, selector, options);

      return element.attr(attributeName);
    }
  };
}
