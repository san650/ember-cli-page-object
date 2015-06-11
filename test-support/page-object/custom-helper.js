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
          let scopedSelector = qualifySelector(parent.scope, selector);

          let customHelperRes = userDefinedFunction(scopedSelector, options);

          if ($.isPlainObject(customHelperRes)) {
            return build($.extend(customHelperRes, { scope: scopedSelector }),
                         key,
                         parent);
          } else if ($.isFunction(customHelperRes)) {
            return customHelperRes(scopedSelector);
          } else {
            return customHelperRes;
          }
        }
      }
    }
  }
};
