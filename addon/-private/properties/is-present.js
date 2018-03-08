import { findElement } from 'ember-cli-page-object';

/**
 * Validates if any element matching the target selector is rendered in the DOM.
 *
 * `isPresent` vs. `isVisible`:
 *   - Both validate that an element matching the target selector can be found in the DOM
 *   - `isVisible` additionally validates that all matching elements are visible
 *
 * Some uses cases for `isPresent` over `isVisible`:
 *   - To check for the presence of a tag that is never visible in the DOM (e.g. `<meta>`).
 *   - To validate that, even though an element may not currently be visible, it is still in the DOM.
 *   - To validate that an element has not merely been hidden but has in fact been removed from the DOM.
 *
 * @example
 *
 * // Lorem <span>ipsum</span>
 *
 * import { create, isPresent } from 'ember-cli-page-object';
 * 
 * const page = create({
 *   spanIsPresent: isPresent('span')
 * });
 *
 * assert.ok(page.spanIsPresent);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span style="display:none">dolor</span>
 *
 * import { create, isPresent } from 'ember-cli-page-object';
 * 
 * const page = create({
 *   spanIsPresent: isPresent('span', { multiple: true })
 * });
 *
 * assert.ok(page.spanIsPresent);
 *
 * @example
 *
 * // <head>
 * //   <meta name='robots' content='noindex'>
 * // </head>
 *
 * import { create, isPresent } from 'ember-cli-page-object';
 * 
 * const page = create({
 *   notIndexed: isPresent(`meta[name='robots'][content='noindex']`, {
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
 * import { create, isPresent } from 'ember-cli-page-object';
 * 
 * const page = create({
 *   spanIsPresent: isPresent('span')
 * });
 *
 * // returns false when element doesn't exist in DOM
 * assert.notOk(page.spanIsPresent);
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
export function isPresent(selector, options) {
  return {
    isDescriptor: true,
    get() {
      return !!findElement(this, selector, options).length;
    }
  };
}
