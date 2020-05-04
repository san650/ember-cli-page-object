import { assign } from '../-private/helpers';
import { findOne } from '../extend';

/**
 * @public
 *
 * Validates if an element or a set of elements don't have a given CSS class.
 *
 * @example
 *
 * // <em class="lorem"></em><span class="success">Message!</span>
 *
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messageIsSuccess: notHasClass('error', 'span')
 * });
 *
 * assert.ok(page.messageIsSuccess);
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
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanNotHasClass: notHasClass('lorem', 'span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanNotHasClass);
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
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanNotHasClass: notHasClass('lorem', 'span')
 * });
 *
 * assert.ok(page.spanNotHasClass);
 *
 * @public
 *
 * @param {string} cssClass - CSS class to be validated
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function notHasClass(cssClass, selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);

      let element = findOne(this, selector, options);

      return !element.classList.contains(cssClass);
    }
  };
}
