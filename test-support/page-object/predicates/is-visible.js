import { findElement, every } from '../helpers';

/**
 * Validates if an element or set of elements are visible
 *
 * @example
 *
 * // Lorem <span>ipsum</span>
 *
 * let page = PageObject.create({
 *   spanIsVisible: PageObject.isVisible('span')
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span style="display:none">dolor</span>
 *
 * let page = PageObject.create({
 *   spansAreVisible: PageObject.isVisible('span', { multiple: true })
 * });
 *
 * // not all spans are visible
 * assert.ok(!page.spansAreVisible);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span>dolor</span>
 *
 * let page = PageObject.create({
 *   spansAreVisible: PageObject.isVisible('span', { multiple: true })
 * });
 *
 * // all spans are visible
 * assert.ok(page.spansAreVisible);
 *
 * @example
 *
 * // Lorem <div>ipsum</div>
 *
 * let page = PageObject.create({
 *   spanIsVisible: PageObject.isHidden('span')
 * });
 *
 * // returns false when element doesn't exist in DOM
 * assert.ok(!page.spanIsVisible);
 *
 * @example
 *
 * // <div><span style="display:none">lorem</span></div>
 *
 * <div class="scope"><span>ipsum</span></div>
 *
 * let page = PageObject.create({
 *   spanIsVisible: PageObject.isHidden('span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @example
 *
 * // <div><span style="display:none">lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 *
 * let page = PageObject.create({
 *   scope: '.scope',
 *   spanIsVisible: PageObject.isHidden('span')
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector are visible
 * @return {Descriptor}
 *
 * @throws Will throw an error if multiple elements are matched by selector and multiple options is not set
 */
export function isVisible(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let elements = findElement(this, selector, options);

      if (elements.length === 0) {
        return false;
      }

      return every(elements, function(element) {
        return element.is(':visible');
      });
    }
  };
}
