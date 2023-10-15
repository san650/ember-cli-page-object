import deprecate from './deprecate';
import { $, buildSelector, findClosestValue, guardMultiple } from './helpers';
import { getAdapter } from '../adapters/index';
import { throwBetterError, ELEMENT_NOT_FOUND } from './better-errors';

function getContainer(pageObjectNode, options) {
  return (
    options.testContainer ||
    findClosestValue(pageObjectNode, 'testContainer') ||
    getAdapter().testContainer
  );
}

/**
 * Finds a single element, otherwise fails
 *
 * @private
 */
export function findOne(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  const elements = $(selector, container).toArray();

  guardMultiple(elements, selector);

  if (elements.length === 0) {
    throwBetterError(pageObjectNode, options.pageObjectKey, ELEMENT_NOT_FOUND, {
      selector,
    });
  }

  return elements[0];
}

/**
 * Finds a elements by query
 *
 * @private
 */
export function findMany(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  return $(selector, container).toArray();
}

/**
 * @private
 * @deprecated
 */
export function findElementWithAssert(
  pageObjectNode,
  targetSelector,
  options = {}
) {
  deprecate(
    'find-element',
    '`findElementWithAssert(` is deprecated. Please, consider using the `findOne(` instead.',
    '2.2.0',
    '3.0.0'
  );

  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  let $elements = $(selector, container);

  guardMultiple($elements, selector, options.multiple);

  if ($elements.length === 0) {
    throwBetterError(pageObjectNode, options.pageObjectKey, ELEMENT_NOT_FOUND, {
      selector,
    });
  }

  return $elements;
}

/**
 * @private
 * @deprecated
 */
export function findElement(pageObjectNode, targetSelector, options = {}) {
  deprecate(
    'find-element',
    '`findElement(` is deprecated. Please, consider using the `findOne(` or `findMany(` instead.',
    '2.2.0',
    '3.0.0'
  );

  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  let $elements = $(selector, container);

  guardMultiple($elements, selector, options.multiple);

  return $elements;
}
