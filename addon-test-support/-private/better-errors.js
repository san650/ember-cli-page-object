import EmberError from '@ember/error';
import Ceibo from 'ceibo';

export const ELEMENT_NOT_FOUND = 'Element not found.';

/**
 * Throws an error with a descriptive message.
 *
 * @param {Ceibo} node              PageObject node containing the property that triggered the error
 * @param {string} key              Key of PageObject property tht triggered the error
 * @param {Error|string} err        Error or error text
 * @param {Object} options
 * @param {string} options.selector Selector of element targeted by PageObject property
 * @return {Ember.Error}
 */
export function throwBetterError(node, key, err, { selector } = {}) {
  let fullErrorMessage = typeof err === Error ? err.message : err.toString();

  let path = [];
  let current;

  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';
  if (key && key.trim().length > 0) {
    path.push(key);
  }

  if (path.length > 0) {
    fullErrorMessage += `\n\nPageObject: '${path.join('.')}'`;
  }

  if (typeof selector === 'string' && selector.trim().length > 0) {
    fullErrorMessage += `\n  Selector: '${selector}'`;
  }

  console.error(fullErrorMessage);
  throw new EmberError(fullErrorMessage);
}
