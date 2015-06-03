/* global wait */

import { isNullOrUndefined } from './helpers';

function Component() {
}

Component.prototype.then = function() {
  return wait().then(...arguments);
};

function isAttribute(candidate) {
  return $.isFunction(candidate.buildPageObjectAttribute);
}

function peekForAttributes(parent) {
  let keys = Object.keys(parent);

  for(let i = 0; i < keys.length; i++) {
    if (isAttribute(parent[keys[i]])) {
      return true;
    }
  }

  return false;
}

function buildComponentIfNeeded(candidate, key, parent) {
  if ($.isPlainObject(candidate) && peekForAttributes(candidate)) {
    return componentAttribute(candidate).buildPageObjectAttribute(key, parent);
  }

  return candidate;
}

export function componentAttribute(definition) {
  return {
    buildPageObjectAttribute: function(key, parent) {
      let component = build(definition);

      if (isNullOrUndefined(component.scope)) {
        component.scope = parent.scope;
      }

      return function() {
        return component;
      };
    }
  };
}

export function build(definition, key, parent) {
  let component = new Component(),
      keys = Object.keys(definition);

  if (isNullOrUndefined(component.scope)) {
    component.scope = definition.scope;
  }

  keys.forEach(function(key) {
    let attr = definition[key];

    if (isAttribute(attr)) {
      component[key] = attr.buildPageObjectAttribute(key, component);
    } else {
      component[key] = buildComponentIfNeeded(attr, key, component);
    }
  });

  return component;
}
