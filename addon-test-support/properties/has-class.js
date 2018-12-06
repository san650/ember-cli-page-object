import { assign, every } from '../-private/helpers';
import { findElementWithAssert } from '../extend'

/**
 * Validates if an element or a set of elements have a given CSS class.
 *
 * @example
 *
 * // <em class="lorem"></em><span class="success">Message!</span>
 *
 * import { create, hasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messageIsSuccess: hasClass('success', 'span')
 * });
 *
 * assert.ok(page.messageIsSuccess);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="error"></span>
 *
 * import { create, hasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messagesAreSuccessful: hasClass('success', 'span', { multiple: true })
 * });
 *
 * assert.notOk(page.messagesAreSuccessful);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="success"></span>
 *
 * import { create, hasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messagesAreSuccessful: hasClass('success', 'span', { multiple: true })
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
 * import { create, hasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanHasClass: hasClass('ipsum', 'span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanHasClass);
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
 * import { create, hasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanHasClass: hasClass('ipsum', 'span')
 * });
 *
 * assert.ok(page.spanHasClass);
 *
 * @public
 *
 * @param {string} cssClass - CSS class to be validated
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector have the CSS class
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function hasClass(cssClass, selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);

      let elements = findElementWithAssert(this, selector, options);

      return every(elements, function(element) {
        return element.hasClass(cssClass);
      });
    }
  };
}
