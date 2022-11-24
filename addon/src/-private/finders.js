import { $, guardMultiple } from './helpers';
import { throwBetterError, ELEMENT_NOT_FOUND } from './better-errors';
import { Query } from './query';

const ELEMENT_NOT_FOUND = 'Element not found.';

/**
 * Finds a single element, otherwise fails
 *
 * @private
 */
export function findOne(pageObjectNode, selector, options = {}) {
  const query = new Query(pageObjectNode, {
    ...options,
    selector,
  });

  const elements = query.all();

  guardMultiple(elements, query);

  if (elements.length === 0) {
    throwBetterError(pageObjectNode, options.pageObjectKey, ELEMENT_NOT_FOUND, {
      selector: query.toString(),
    });
  }

  return elements[0];
}

/**
 * Finds a elements by query
 *
 * @private
 */
export function findMany(pageObjectNode, selector, options = {}) {
  const query = new Query(pageObjectNode, {
    ...options,
    selector,
  });

  return query.all();
}

/**
 * @private
 * @deprecated
 */
export function findElementWithAssert(pageObjectNode, selector, options = {}) {
  const query = new Query(pageObjectNode, {
    ...options,
    selector,
  });

  let $elements = $(query.all());

  guardMultiple($elements, query, options.multiple);

  if ($elements.length === 0) {
    throwBetterError(pageObjectNode, options.pageObjectKey, ELEMENT_NOT_FOUND, {
      selector: query.toString(),
    });
  }

  return $elements;
}

/**
 * @private
 * @deprecated
 */
export function findElement(pageObjectNode, selector, options = {}) {
  const query = new Query(pageObjectNode, {
    ...options,
    selector,
  });

  let $elements = $(query.all());

  guardMultiple($elements, query, options.multiple);

  return $elements;
}
