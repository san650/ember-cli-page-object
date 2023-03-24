import { containsText } from '../-private/element';
import { findOne } from '../-private/finders';
import { getter } from '../macros/index';

/**
 * Returns a boolean representing whether an element or a set of elements contains the specified text.
 *
 * @example
 *
 * // Lorem <span>ipsum</span>
 *
 * import { create, contains } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanContains: contains('span')
 * });
 *
 * assert.ok(page.spanContains('ipsum'));
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * import { create, contains } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanContains: contains('span', { scope: '.scope' })
 * });
 *
 * assert.notOk(page.spanContains('lorem'));
 * assert.ok(page.spanContains('ipsum'));
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * import { create, contains } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanContains: contains('span')
 * });
 *
 * assert.notOk(page.spanContains('lorem'));
 * assert.ok(page.spanContains('ipsum'));
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
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function contains(selector, userOptions = {}) {
  return getter(function (key) {
    return function (textToSearch) {
      let options = {
        pageObjectKey: `${key}("${textToSearch}")`,
        ...userOptions,
      };

      const element = findOne(this, selector, options);

      return containsText(element, textToSearch);
    };
  });
}
