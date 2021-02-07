import {
  buildSelector,
  findClosestValue,
  guardMultiple
} from './helpers';
import { getAdapter } from '../adapters';
import { throwBetterError, ELEMENT_NOT_FOUND } from './better-errors';
import jQuery from 'jquery';

function getContainer(pageObjectNode, options) {
  return options.testContainer
    || findClosestValue(pageObjectNode, 'testContainer')
    || getAdapter().testContainer;
}

export function $(selector, container) {
  const { window } = getAdapter();

  if (window) {
    return jQuery(window)(selector, container)
  } else {
    return jQuery(selector, container);
  }
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
    throwBetterError(
      pageObjectNode,
      options.pageObjectKey,
      ELEMENT_NOT_FOUND,
      { selector }
    );
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
export function findElementWithAssert(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  let $elements = $(selector, container);

  guardMultiple($elements, selector, options.multiple);

  if ($elements.length === 0) {
    throwBetterError(
      pageObjectNode,
      options.pageObjectKey,
      ELEMENT_NOT_FOUND,
      { selector }
    );
  }

  return $elements;
}

/**
 * @private
 * @deprecated
 */
export function findElement(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  let $elements = $(selector, container);

  guardMultiple($elements, selector, options.multiple);

  return $elements;
}
