import { findElementWithAssert, trim } from '../helpers';

var $ = Ember.$;

/**
 * Gets the value of the matched element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     search: value('input')
 *   });
 *
 *   assert.equal(page.search, 'search term');
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function value(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var element = findElementWithAssert(this, selector, options);

      if (options.multiple) {
        result = $.map(element, e => $(e).val());
      } else {
        result = element.val();
      }

      return result;
    }
  };
}
