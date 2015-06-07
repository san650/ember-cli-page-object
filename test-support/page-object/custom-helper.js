import Ember from 'ember';
import { build } from './build';

export function customHelper(userDefinedFunction) {
  return function(selector, options) {
    return {
      userDefinedFunction: userDefinedFunction,
      buildPageObjectAttribute: function(key, parent) {
        let scope = parent.scope;

        return build(this.userDefinedFunction(scope, selector, options),
                     key,
                     parent);
      }
    }
  }
};
