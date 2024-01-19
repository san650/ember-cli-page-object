import Ceibo from '@ro0gr/ceibo';
import { buildSelector } from './helpers';

export const ELEMENT_NOT_FOUND = 'Element not found.';

export function throwContextualError(node, filters, e) {
  const selector = buildSelector(node, filters.selector, filters);

  throwBetterError(node, filters.pageObjectKey, e, { selector });
}

/**
 * Throws an error with a descriptive message.
 *
 * @param {Ceibo} node              PageObject node containing the property that triggered the error
 * @param {string} key              Key of PageObject property tht triggered the error
 * @param {string} error            Error message or Error instance
 * @param {Object} options
 * @param {string} options.selector Selector of element targeted by PageObject property
 * @return {Ember.Error}
 */
export function throwBetterError(node, key, error, { selector } = {}) {
  let message = error instanceof Error ? error.message : error.toString();

  const wrapperError = new PageObjectError(message, {
    cause: {
      message,
      key,
      node,
      selector,
    },
  });

  if (error instanceof Error && 'stack' in error) {
    wrapperError.stack = error.stack;
  }

  console.error(wrapperError.toString());
  throw wrapperError;
}

export class PageObjectError extends Error {
  constructor(message, options = {}, ...args) {
    const { cause } = options;
    const { node, key, selector } = cause || {};

    const errorDescription = buildErrorDescription(node, key, selector);

    super(
      [message, errorDescription].filter(Boolean).join('\n'),
      options,
      ...args
    );
  }
}

function buildErrorDescription(node, key, selector) {
  const lines = [];

  const path = buildPropertyNamesPath(node);
  if (key) {
    path.push(key);
  }
  lines.push(`\nPageObject: '${path.join('.')}'`);

  if (typeof selector === 'string' && selector.trim().length > 0) {
    lines.push(`  Selector: '${selector}'`);
  }

  return lines.join('\n');
}

function buildPropertyNamesPath(node) {
  let path = [];

  let current;
  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  // replace "root" with "page"
  path[0] = 'page';

  return path;
}
