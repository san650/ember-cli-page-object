/* global findWithAssert */

import { qualifySelector, trim } from './helpers';

function query(fn) {
  return function(selector, options = {}) {
    return {
      build: function(key, page) {
        let qualifiedSelector = qualifySelector(options.scope || page.scope, selector);

        return function(...args) {
          let element = findWithAssert(qualifiedSelector);

          return fn(element, ...args);
        };
      }
    };
  };
}

const attribute = query((element, key) => element.attr(key)),
      count = query(elements => elements.length),
      text = query(element => trim(element.text())),
      value = query(element => element.val());

export {
  attribute,
  count,
  text,
  value
};
