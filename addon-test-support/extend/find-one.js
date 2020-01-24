import { getExecutionContext } from '../-private/execution_context';
import { filterWhitelistedOption } from "../-private/helpers";

/**
 * @public
 *
 * Returns a element
 *
 * @example
 *
 * import { findOne } from 'ember-cli-page-object';
 *
 * export default function isDisabled(selector, options = {}) {
 *   return {
 *     isDescriptor: true,
 *
 *     get() {
 *       return findOne(this, selector, options).disabled;
 *     }
 *   };
 * }
 *
 * @param {Ceibo} pageObjectNode - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {string} options.scope
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
export function findOne(pageObjectNode, targetSelector, options = {}) {
  const filteredOptions = filterWhitelistedOption(options, [
    'resetScope', 'visible', 'testContainer', 'contains', 'at', 'last', 'scope', 'pageObjectKey'
  ]);
  const opts = Object.assign({}, filteredOptions, { multiple: false });
  return getExecutionContext(pageObjectNode).findWithAssert(targetSelector, opts).get(0);
}
