import $ from '-jquery';
import {
  buildSelector,
  findClosestValue
} from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

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
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Array} of Element
 */
export function findMany(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  return $(selector, container).toArray();
}

function getContainer(pageObjectNode, options) {
  return options.testContainer
    || findClosestValue(pageObjectNode, 'testContainer')
    || getExecutionContext(pageObjectNode).testContainer;
}
