import { findElementWithAssert, every } from '../helpers';

/**
 * Validates if an element or a set of elements don't have a given CSS class
 *
 * @example
 *
 * // <em class="lorem"></em><span class="success">Message!</span>
 *
 * let page = PageObject.create({
 *   messageIsSuccess: PageObject.nothasClass('error', 'span')
 * });
 *
 * assert.ok(page.messageIsSuccess);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="error"></span>
 *
 * let page = PageObject.create({
 *   messagesAreSuccessful: PageObject.notHasClass('error', 'span', { multiple: true })
 * });
 *
 * // one span has error class
 * assert.ok(!page.messagesAreSuccessful);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="success"></span>
 *
 * let page = PageObject.create({
 *   messagesAreSuccessful: PageObject.notHasClass('error', 'span', { multiple: true })
 * });
 *
 * // no spans have error class
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
 *   spanHasNotClass: PageObject.notHasClass('lorem', 'span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanHasNotClass);
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
 *   spanHasNotClass: PageObject.notHasClass('lorem', 'span')
 * });
 *
 * assert.ok(page.spanHasNotClass);
 *
 * @public
 *
 * @param {string} cssClass - CSS class to be validated
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector don't have the CSS class
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple options is not set
 */
export function notHasClass(cssClass, selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var elements = findElementWithAssert(this, selector, options);

      return every(elements, function(element) {
        return !element.hasClass(cssClass);
      });
    }
  };
}
