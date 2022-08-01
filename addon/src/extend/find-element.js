/**
 * @public
 *
 * Returns a jQuery element (can be an empty jQuery result)
 *
 * @example
 *
 * import { getter } from 'ember-cli-page-object/macros';
 * import { findElement } from 'ember-cli-page-object/extend';
 *
 * function isDisabled(selector) {
 *   return getter(function (pageObjectKey) {
 *     return findElement(this, selector, { pageObjectKey }).is(':disabled');
 *   });
 * }
 *
 * @param {Ceibo} pageObjectNode - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @param {boolean} options.multiple - Specify if built selector can match multiple elements.
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Object} jQuery object
 *
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export { findElement } from '../-private/finders';
