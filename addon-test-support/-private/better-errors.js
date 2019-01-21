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
  let current;
  let path = [key];
  const msg = typeof err === Error
    ? err.message
    : err.toString();

  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';

  let fullErrorMessage = `${msg}\n\nPageObject: '${path.join('.')}'`;

  if (selector) {
    fullErrorMessage = `${fullErrorMessage}\n  Selector: '${selector}'`;
  }

  console.error(fullErrorMessage);
  throw new EmberError(fullErrorMessage);
}
