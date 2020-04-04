import { getExecutionContext } from '../-private/execution_context';
import { deprecate } from '@ember/application/deprecations';

/**
 * @public
 *
 * Returns a jQuery element (can be an empty jQuery result)
 *
 * @example
 *
 * import { findElement } from 'ember-cli-page-object/extend';
 *
 * export default function isDisabled(selector, options = {}) {
 *   return {
 *     isDescriptor: true,
 *
 *     get() {
 *       return findElement(this, selector, options).is(':disabled');
 *     }
 *   };
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
export function findElement(pageObjectNode, targetSelector, options = {}) {
  deprecate('findElement is deprecated, please use findOne or findMany instead', false, {
    id: 'ember-cli-page-object.old-finders',
    until: '2.0.0',
    url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#old-finders'
  });

  const shouldShowMutlipleDeprecation = 'multiple' in options;
  deprecate('"multiple" property is deprecated', !shouldShowMutlipleDeprecation, {
    id: 'ember-cli-page-object.multiple',
    until: '2.0.0',
    url: 'https://ember-cli-page-object.js.org/docs/v1.17.x/deprecations/#multiple',
  });

  return getExecutionContext(pageObjectNode).find(targetSelector, options);
}
