import { qualifySelector } from './helpers';

function qualifiedSelector() {
  return qualifySelector(this.options.scope || this.page.scope, this.selector);
}

function Attribute(fn, selector = null, options = null, extraArgs = {}) {
  this.fn = fn;
  this.context = $.extend({ selector, options }, extraArgs);
  this.context.qualifiedSelector = qualifiedSelector;
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
