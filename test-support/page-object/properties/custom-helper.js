import Ember from 'ember';
import { build } from '../build';
import Descriptor from '../descriptor';
import { qualifySelector } from '../helpers';

function action(target, key, options, ...args){
  let selector = qualifySelector(options.scope || target.scope, options.selector);

  let response = options.userDefinedFunction(selector, options);

  if (response && response.unfoldPageObjectDefinition) {
    response = response.unfoldPageObjectDefinition();
  }

  if ($.isPlainObject(response)) {
    let definition = $.extend({ scope: selector }, response);

    return build(definition);
  } else if ($.isFunction(response)) {
    return response(...args);
  } else {
    return response;
  }
}

export default function customHelper(userDefinedFunction) {
  return function(selector, options = {}) {
    options.selector = selector;
    options.userDefinedFunction = userDefinedFunction;

    return new Descriptor(action, options);
  }
};
