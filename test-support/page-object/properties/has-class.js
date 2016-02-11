import { findElementWithAssert, every } from '../helpers';

/**
 * Creates a predicate to validate if an element or a set of elements have a given CSS class
 *
 * @example
 *
 * // <em class="lorem"></em><span class="success">Message!</span>
 *
 * let page = PageObject.create({
 *   messageIsSuccess: PageObject.hasClass('success', 'span')
 * });
 *
 * assert.ok(page.message);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="error"></span>
 *
 * let page = PageObject.create({
 *   messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
 * });
 *
 * assert.ok(!page.messagesAreSuccessful);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="success"></span>
 *
 * let page = PageObject.create({
 *   messagesAreSuccessful: PageObject.hasClass('success', 'span', { multiple: true })
 * });
 *
 * assert.ok(page.messagesAreSuccessful);
 *
 * @example
 *
 * // <div>
 * //   <span class="lorem"></span>
 * // </div>
 * // <div class="scope">
 * //   <span class="ipsum"></span>
 * // </div>
 *
 * let page = PageObject.create({
 *   messageIsSuccess: PageObject.hasClass('ipsum', 'span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.foo);
 *
 * @example
 *
 * // <div>
 * //   <span class="lorem"></span>
 * // </div>
 * // <div class="scope">
 * //   <span class="ipsum"></span>
 * // </div>
 *
 * let page = PageObject.create({
 *   scope: '.scope',
 *   messageIsSuccess: PageObject.hasClass('ipsum', 'span')
 * });
 *
 * assert.ok(page.foo);
 *
 * @public
 *
 * @param {string} cssClass - CSS class to be validated
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector have the CSS class
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple options is not set
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
