import Ember from 'ember';
import Ceibo from './ceibo';

function getScopes(target) {
  var scopes = [];

  if (target.scope) {
    scopes.push(target.scope);
  }

  if (Ceibo.parent(target)) {
    scopes = scopes.concat(calculateScope(Ceibo.parent(target)));
  }

  return scopes;
}

function calculateScope(target, propertyScope) {
  var scopes = getScopes(target);

  scopes.reverse();
  scopes.push(propertyScope);

  return $.trim(scopes.join(' '));
}

function query(tree, selector, options, fn) {
  var scope;

  if (options.resetScope) {
    scope = options.scope;
  } else {
    scope = calculateScope(tree, options.scope);
  }

  if (!selector) {
    selector = scope;
    scope = undefined;
  }

  if (typeof options.at === 'number') {
    selector = `${selector}:eq(${options.at})`;
  }

  return fn(selector, scope);
}

export function findElementWithAssert(tree, selector, options) {
  return query(tree, selector, options, findWithAssert);
}

export function findElement(tree, selector, options, target) {
  return query(tree, selector, options, find);
}

/**
 * Trim whitespaces at both ends and normalize whitespaces inside `text`
 *
 * Due to variations in the HTML parsers in different browsers, the text
 * returned may vary in newlines and other white space.
 *
 * @see http://api.jquery.com/text/
 */
export function normalizeText(text) {
  return Ember.$.trim(text).replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
}
