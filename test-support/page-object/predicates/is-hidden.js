import { findElement, every } from '../helpers';

/**
 * Validates if an element or set of elements are hidden
 *
 * @example
 *
 * // Lorem <span style="display:none">ipsum</span>
 *
 * let page = PageObject.create({
 *   spanIsHidden: PageObject.isHidden('span')
 * });
 *
 * assert.ok(page.spanIsHidden);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span style="display:none">dolor</span>
 *
 * let page = create({
 *   spansAreHidden: PageObject.isHidden('span', { multiple: true })
 * });
 *
 * // not all spans are hidden
 * assert.ok(!page.spansAreHidden);
 *
 * @example
 *
 * // <span style="display:none">dolor</span>
 * // <span style="display:none">dolor</span>
 *
 * let page = create({
 *   spansAreHidden: PageObject.isHidden('span', { multiple: true })
 * });
 *
 * // all spans are hidden
 * assert.ok(page.spansAreHidden);
 *
 * @example
 *
 * // Lorem <div>ipsum</div>
 *
 * let page = PageObject.create({
 *   spanIsHidden: PageObject.isHidden('span')
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
 * let page = PageObject.create({
 *   scopedSpanIsHidden: PageObject.isHidden('span', { scope: '.scope' })
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
 * let page = PageObject.create({
 *   scope: '.scope',
 *   scopedSpanIsHidden: PageObject.isHidden('span')
 * });
 *
 * assert.ok(page.scopedSpanIsHidden);
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector are hidden
 * @return {Descriptor}
 *
 * @throws Will throw an error if multiple elements are matched by selector and multiple options is not set
 */
export function isHidden(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let elements = findElement(this, selector, options);

      return every(elements, function(element) {
        return element.is(':hidden');
      });
    }
  };
}
