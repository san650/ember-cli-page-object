import { findElement } from 'ember-cli-page-object';

/**
 * Validates if an element or set of elements are in the DOM. In most cases,
 * it is preferred to use `isVisible` instead as it provides a slightly
 * stronger guarantee. However, a use case for `exists` is to check the
 * presence of a <meta> tag on the page.
 *
 * @example
 *
 * // Lorem <span>ipsum</span>
 *
 * const page = PageObject.create({
 *   spanExists: PageObject.exists('span')
 * });
 *
 * assert.ok(page.spanExists);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span style="display:none">dolor</span>
 *
 * const page = PageObject.create({
 *   spansExist: PageObject.exists('span', { multiple: true })
 * });
 *
 * assert.ok(page.spansExist);
 *
 * @example
 *
 * // <head>
 * //   <meta name='robots' content='noindex'>
 * // </head>
 *
 * const page = PageObject.create({
 *   notIndexed: PageObject.exists(`meta[name='robots'][content='noindex']`, {
 *     testContainer: 'head'
 *   })
 * });
 *
 * assert.ok(page.notIndexed);
 *
 * @example
 *
 * // Lorem <strong>ipsum</strong>
 *
 * const page = PageObject.create({
 *   spanExists: PageObject.exists('span')
 * });
 *
 * // returns false when element doesn't exist in DOM
 * assert.notOk(page.spanExists);
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector are visible
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function exists(selector, options) {
  return {
    isDescriptor: true,
    get() {
      return !!findElement(this, selector, options).length;
    }
  };
}
