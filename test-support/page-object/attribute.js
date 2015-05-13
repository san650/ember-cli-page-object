/* global findWithAssert, find */

import { qualifySelector } from './helpers';

function qualifiedSelector() {
  return qualifySelector(this.options.scope || this.page.scope, this.selector);
}

function findElementWithAssert() {
  return findWithAssert(this.qualifiedSelector());
}

function findElement() {
  return find(this.qualifiedSelector());
}

function Attribute(fn, selector = null, options = null, extraArgs = {}) {
  this.fn = fn;
  this.context = $.extend({
    element: findElement,
    elementOrRaise: findElementWithAssert,
    options,
    qualifiedSelector,
    selector
  }, extraArgs);
}

Attribute.prototype = {
  build: function(key, page) {
    var fn = this.fn,
        context = this.context;

    this.context.key = key;
    this.context.page = page;

    return function(...args) {
      return fn.apply(context, args);
    }
  }
};

export default Attribute;
