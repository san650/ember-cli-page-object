import { getExecutionContext } from '../-private/execution_context';
import { assertOptionsWhitelisted } from '../-private/helpers';
/**
 * @public
 *
 * Returns array of elements
 *
 * @example
 *
 * import { findMany } from '../extend';
 *
 * export default function count(selector, options = {}) {
 *   return {
 *     isDescriptor: true,
 *
 *     get() {
 *       return findMany(this, selector, options).length;
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
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Array} of Element
 */
export function findMany(pageObjectNode, targetSelector, options = {}) {
  assertOptionsWhitelisted(options, ['resetScope', 'visible', 'testContainer', 'contains', 'scope']);
  const opts = Object.assign({}, options, { multiple: true });
  return getExecutionContext(pageObjectNode).find(targetSelector, opts).get();
}
