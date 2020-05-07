import $ from '-jquery';
import {
  buildSelector,
  findClosestValue,
  guardMultiple
} from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';
import { throwBetterError, ELEMENT_NOT_FOUND } from '../-private/better-errors';

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
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  const elements = $(selector, container).toArray();

  guardMultiple(elements, selector);

  if (elements.length === 0) {
    throwBetterError(
      pageObjectNode,
      options.pageObjectKey,
      ELEMENT_NOT_FOUND,
      { selector }
    );
  }

  return elements[0];
}

function getContainer(pageObjectNode, options) {
  return options.testContainer
    || findClosestValue(pageObjectNode, 'testContainer')
    || getExecutionContext(pageObjectNode).testContainer;
}
