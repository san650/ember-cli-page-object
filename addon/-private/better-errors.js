import Ember from 'ember';
import Ceibo from 'ceibo';

export const ELEMENT_NOT_FOUND = 'Element not found.';
export const PROPERTY_NOT_FOUND = 'PageObject does not contain property';

/**
 * Throws an error with a descriptive message.
 *
 * @param {Ceibo} node              PageObject node containing the property that triggered the error
 * @param {string} key              Key of PageObject property tht triggered the error
 * @param {string} msg              Error message
 * @param {Object} options
 * @param {string} options.selector Selector of element targeted by PageObject property
 * @return {Ember.Error}
 */
export function throwBetterError(node, key, msg, { selector } = {}) {
  let path = [key];
  let current;

  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';

  let fullErrorMessage = `${msg}\n\nPageObject: '${path.join('.')}'`;

  if (selector) {
    fullErrorMessage = `${fullErrorMessage}\n  Selector: '${selector}'`;
  }

  Ember.Logger.error(fullErrorMessage);
  throw new Ember.Error(fullErrorMessage);
}
