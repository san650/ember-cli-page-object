import { findMany } from '../-private/finders';
import { getter } from '../macros/index';

/**
 * @public
 *
 * Returns the number of elements matched by a selector.
 *
 * @example
 *
 * // <span>1</span>
 * // <span>2</span>
 *
 * import { create, count } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanCount: count('span')
 * });
 *
 * assert.equal(page.spanCount, 2);
 *
 * @example
 *
 * // <div>Text</div>
 *
 * import { create, count } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanCount: count('span')
 * });
 *
 * assert.equal(page.spanCount, 0);
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * import { create, count } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanCount: count('span', { scope: '.scope' })
 * });
 *
 * assert.equal(page.spanCount, 2)
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * import { create, count } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanCount: count('span')
 * });
 *
 * assert.equal(page.spanCount, 2)
 *
 * @example
 *
 * // <div><span></span></div>
 * // <div class="scope"><span></span><span></span></div>
 *
 * import { create, count } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanCount: count('span', { resetScope: true })
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
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */
export function count(selector, userOptions = {}) {
  return getter(function (key) {
    let options = {
      pageObjectKey: key,
      ...userOptions,
    };

    return findMany(this, selector, options).length;
  });
}
