import { assign, guardMultiple } from '../-private/helpers';
import { findMany } from '../extend';
import $ from '-jquery';

/**
 * Validates if an element or set of elements are visible.
 *
 * @example
 *
 * // Lorem <span>ipsum</span>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsVisible: isVisible('span')
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @example
 *
 * // Lorem <strong>ipsum</strong>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsVisible: isVisible('span')
 * });
 *
 * // returns false when element doesn't exist in DOM
 * assert.notOk(page.spanIsVisible);
 *
 * @example
 *
 * // <div>
 * //   <span style="display:none">lorem</span>
 * // </div>
 * // <div class="scope">
 * //   <span>ipsum</span>
 * // </div>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsVisible: isVisible('span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @example
 *
 * // <div>
 * //   <span style="display:none">lorem</span>
 * // </div>
 * // <div class="scope">
 * //   <span>ipsum</span>
 * // </div>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanIsVisible: isVisible('span')
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function isVisible(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);

      let elements = findMany(this, selector, options);
      guardMultiple(elements, selector, options.multiple);

      return elements.length === 1 && $(elements[0]).is(':visible');
    }
  };
}
