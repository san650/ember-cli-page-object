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

  const err = new PageObjectError(key, node, selector, message);
  if (error instanceof Error && 'stack' in error) {
    err.stack = error.stack;
  }

  console.error(err.toString());
  throw err;
}

export class PageObjectError extends Error {
  constructor(label, node, selector, ...args) {
    super(...args);

    this.label = label;
    this.node = node;
    this.selector = selector;
  }

  toString() {
    let { message, label, node, selector } = this;
    if (label) {
      let path = buildPropertyNamesPath(label, node);
      message = `${message}\n\nPageObject: '${path.join('.')}'`;
    }

    if (typeof selector === 'string' && selector.trim().length > 0) {
      message = `${message}\n  Selector: '${selector}'`;
    }

    return `Error: ${message}`;
  }
}

function buildPropertyNamesPath(leafKey, node) {
  let path = [leafKey];

  let current;
  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';

  return path;
}
