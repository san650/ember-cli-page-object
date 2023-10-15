/**
 * @public
 *
 * Returns array of elements
 *
 * @example
 *
 * import { getter } from 'ember-cli-page-object/macros';
 * import { findMany } from 'ember-cli-page-object/extend';
 *
 * export default function count(selector, options = {}) {
 *   return getter(function () {
 *     return findMany(this, selector, options).length;
 *   });
 * }
 *
 * @param {Ceibo} pageObjectNode - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {string} options.scope CSS Selector to prepend to the target selector
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Array} of Element
 */
export { findMany } from '../-private/finders';
