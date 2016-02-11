import Ember from 'ember';
import { findElement } from '../helpers';

var $ = Ember.$;

/**
 * Gets the count of elements matched by selector
 *
 * @example
 *
 * // <span>1</span>
 * // <span>2</span>
 *
 * var page = PageObject.create({
 *   spanCount: PageObject.count('span')
 * });
 *
 * assert.equal(page.spanCount, 2);
 *
 * @example
 *
 * // <div>Text</div>
 *
 * var page = PageObject.create({
 *   spanCount: PageObject.count('span')
 * });
 *
 * assert.equal(page.spanCount, 0);
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * var page = PageObject.create({
 *   spanCount: PageObject.count('span', { scope: '.scope' })
 * });
 *
 * assert.equal(page.spanCount, 2)
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * var page = PageObject.create({
 *   scope: '.scope',
 *   spanCount: PageObject.count('span')
 * });
 *
 * assert.equal(page.spanCount, 2)
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * var page = PageObject.create({
 *   scope: '.scope',
 *   spanCount: PageObject.count('span', { resetScope: true })
 * });
 *
 * assert.equal(page.spanCount, 1);
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element or elements to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Add scope
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function count(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let countOptions = {};

      $.extend(true, countOptions, options, { multiple: true });

      return findElement(this, selector, countOptions).length;
    }
  };
}
