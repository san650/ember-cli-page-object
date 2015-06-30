import Ember from 'ember';
import { build } from './build';
import {
  qualifySelector,
  indexedSelector
} from './helpers';

function qualifySelectorWithOptions(parentScope, optionsScope, optionsIndex, selector) {
  return qualifySelector(optionsScope || parentScope, indexedSelector(selector, optionsIndex));
}

export function customHelper(userDefinedFunction) {
  return function(selector, options) {
    options = options || {};

    return {
      buildPageObjectAttribute: function(key, parent) {
        return function(...params) {
          let qualifiedSelector = qualifySelectorWithOptions(
                parent.scope,
                options.scope,
                options.index,
                selector
              ),
              response = userDefinedFunction(qualifiedSelector, options),
              processedResponse;

          if ($.isPlainObject(response)) {
            let definition = $.extend({ scope: qualifiedSelector }, response);

            processedResponse = build(definition, key, parent);
          } else if ($.isFunction(response)) {
            processedResponse = response(...params);
          } else {
            processedResponse = response;
          }

          return processedResponse;
        }
      }
    }
  }
};
