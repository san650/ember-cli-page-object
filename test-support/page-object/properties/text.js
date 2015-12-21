import Ceibo from '../ceibo';
import { normalizeText } from '../helpers';

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

function findElementWithAssert(tree, selector, options) {
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

export function text(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var element = findElementWithAssert(this, selector, options);

      return normalizeText(element.text());
    }
  };
};
