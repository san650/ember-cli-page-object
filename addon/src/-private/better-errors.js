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
  let path = [key];
  let current;

  let fullErrorMessage =
    error instanceof Error ? error.message : error.toString();

  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';

  if (path.length > 0) {
    fullErrorMessage += `\n\nPageObject: '${path.join('.')}'`;
  }

  if (typeof selector === 'string' && selector.trim().length > 0) {
    fullErrorMessage = `${fullErrorMessage}\n  Selector: '${selector}'`;
  }

  const err = new Error(fullErrorMessage);
  if (error instanceof Error && 'stack' in error) {
    err.stack = error.stack;
  }

  console.error(err.message);
  throw err;
}
