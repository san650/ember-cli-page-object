import Ember from 'ember';
import { findElement } from '../helpers';

var $ = Ember.$;

/**
 * Gets the count of matched elements
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
 * // returns 2
 * page.spanCount
 *
 * @example
 *
 * // <div>Text</div>
 *
 * var page = PageObject.create({
 *   spanCount: PageObject.count('span')
 * })
 *
 * // returns 0
 * page.spanCount
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * var page = PageObject.create({
 *   spanCount: PageObject.count('span', { scope: '.scope' })
 * })
 *
 * // returns 2
 * page.spanCount
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * var page = PageObject.create({
 *   scope: '.scope',
 *   spanCount: PageObject.count('span')
 * })
 *
 * // returns 2
 * page.spanCount
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * var page = PageObject.create({
 *   scope: '.scope',
 *   spanCount: PageObject.count('span', { resetScope: true })
 * })
 *
 * // returns 1
 * page.spanCount
 *
 * @param {string} selector - CSS selector of the element or elements to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Add scope
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor} - Descriptor that returns amount of elements matched by selector
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
