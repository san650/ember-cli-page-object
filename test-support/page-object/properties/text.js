import { findElementWithAssert, normalizeText } from '../helpers';

/**
 * Gets the text of the matched element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     title: text('h1')
 *   });
 *
 *   assert.equal(page.title(), 'Page title');
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export function text(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var element = findElementWithAssert(this, selector, options);

      return normalizeText(element.text());
    }
  };
};
