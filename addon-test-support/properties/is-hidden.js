import { assign, guardMultiple } from '../-private/helpers';
import { findMany } from '../extend';
import $ from '-jquery';

/**
 * Validates if an element or set of elements is hidden or does not exist in the DOM.
 *
 * @example
 *
 * // Lorem <span style="display:none">ipsum</span>
 *
 * import { create, isHidden } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsHidden: isHidden('span')
 * });
 *
 * assert.ok(page.spanIsHidden);
 *
 * @example
 *
 * // Lorem <strong>ipsum</strong>
 *
 * import { create, isHidden } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsHidden: isHidden('span')
 * });
 *
 * // returns true when element doesn't exist in DOM
 * assert.ok(page.spanIsHidden);
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span style="display:none">ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * import { create, isHidden } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scopedSpanIsHidden: isHidden('span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.scopedSpanIsHidden);
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span style="display:none">ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * import { create, isHidden } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   scopedSpanIsHidden: isHidden('span')
 * });
 *
 * assert.ok(page.scopedSpanIsHidden);
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
export function isHidden(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);

      let elements = findMany(this, selector, options);

      guardMultiple(elements, selector);

      return elements.length === 0 || $(elements[0]).is(':hidden');
    }
  };
}
