import Ember from 'ember';
import { build } from './build';
import { qualifySelector } from './helpers';

export function customHelper(userDefinedFunction) {
  return function(selector, options) {
    // def
    return {
      buildPageObjectAttribute: function(key, parent) {
        // def
        return function() {
          // eval
          let qualifiedSelector = qualifySelector(parent.scope, selector),
            response = userDefinedFunction(qualifiedSelector, options),
            processedResponse;

          if ($.isPlainObject(response)) {
            let definition = $.extend({ scope: qualifiedSelector }, response);

            processedResponse = build(definition, key, parent);
          } else if ($.isFunction(response)) {
            processedResponse = response();
          } else {
            processedResponse = response;
          }

          return processedResponse;
        }
      }
    }
  }
};
