/**
 * @public
 *
 * Returns a element
 *
 * @example
 *
 * import { getter } from 'ember-cli-page-object/macros';
 * import { findOne } from 'ember-cli-page-object';
 *
 * function isDisabled(selector, options = {}) {
 *   return getter(function () {
 *     return findOne(this, selector, options).disabled;
 *   });
 * }
 *
 * @param {Ceibo} pageObjectNode - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {string} options.scope Selector to prepend to the target selector
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @param {string} options.pageObjectKey - Used in the error message when the element is not found
 * @return {Element}
 *
 * @throws If no elements found
 * @throws If more than one element found
 */
export { findOne } from '../-private/finders';
