/* global visit, fillIn, click */

import { qualifySelector } from './helpers';

function action(fn) {
  return function(selector, options = {}) {
    return {
      build: function(key, page) {
        return function(...args) {
          let qualifiedSelector = qualifySelector(options.scope || page.scope, selector);

          page.lastPromise = fn(qualifiedSelector, ...args);

          return page;
        };
      }
    };
  };
}

export function visitable(path) {
  return {
    build: function(key, page) {
      return function() {
        page.lastPromise = visit(path);

        return page;
      };
    }
  };
}

export var fillable = action((selector, text) => fillIn(selector, text));
export var clickable = action((selector) => click(selector));

// function clickableByText(selector, scope) {
//   var qualifiedSelector = qualifySelector(scope, selector);
// 
//   return function(text) {
//     return click('%@ :contains("%@"):last'.fmt(qualifiedSelector, text));
//   };
// }
