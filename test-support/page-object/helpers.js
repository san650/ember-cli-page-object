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

export function findElementWithAssert(tree, selector, options) {
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

  if (options.at) {
    selector = `${selector}:eq(${options.at})`;
  }

  return findWithAssert(selector, scope);
}

// export function findElement(options, target) {
//   let selector = qualifySelector(
//     options.scope || target.scope,
//     indexedSelector(options.selector, options.index)
//   );
//
//   /* global find */
//   return find(selector);
// }

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
