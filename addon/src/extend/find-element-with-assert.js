/**
 * @public
 * @deprecated
 *
 * Returns a jQuery element matched by a selector built from parameters
 *
 * @example
 *
 * import { getter } from 'ember-cli-page-object/macros';
 * import { findElementWithAssert } from 'ember-cli-page-object/extend';
 *
 * export default function isDisabled(selector, options) {
 *   return getter(function () {
 *     return findElementWithAssert(this, selector, options).is(':disabled');
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
 * @param {string} options.pageObjectKey - Used in the error message when the element is not found
 * @return {Object} jQuery object
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export { findElementWithAssert } from '../-private/finders';
