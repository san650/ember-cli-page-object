/* global find, findWithAssert */

import { qualifySelector } from './helpers';

export function hasClass(cssClass, selector, options = {}) {
  return {
    build: function(key, page) {
      return function() {
        let qualifiedSelector = qualifySelector(options.scope || page.scope, selector),
            element = findWithAssert(qualifiedSelector);

        return element.hasClass(cssClass);
      };
    }
  };
}

export function notHasClass(cssClass, selector, options = {}) {
  return {
    build: function(key, page) {
      return function() {
        let qualifiedSelector = qualifySelector(options.scope || page.scope, selector),
            element = findWithAssert(qualifiedSelector);

        return !element.hasClass(cssClass);
      };
    }
  };
}

export function isVisible(selector, options = {}) {
  return {
    build: function(key, page) {
      return function() {
        let qualifiedSelector = qualifySelector(options.scope || page.scope, selector),
            element = findWithAssert(qualifiedSelector);

        return element.is(':visible');
      };
    }
  };
}

export function isHidden(selector, options = {}) {
  return {
    build: function(key, page) {
      return function() {
        let qualifiedSelector = qualifySelector(options.scope || page.scope, selector),
            element = find(qualifiedSelector);

        return (element.length > 0) ? element.is(':hidden') : true;
      };
    }
  };
}
