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
          let customHelperRes = userDefinedFunction(selector, options),
            scope = qualifySelector(parent.scope, selector);

          return build($.extend(customHelperRes, { scope: scope }),
                                key,
                                parent);
        }
      }
    }
  }
};
