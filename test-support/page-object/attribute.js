import {
  qualifySelector,
  indexedSelector
} from './helpers';

function qualifiedSelector(...extras) {
  return qualifySelector(this.options.scope || this.page.scope,
                         indexedSelector(this.selector, this.options['index']),
                         ...extras);
}

function findElementWithAssert() {
  return window.findWithAssert(this.qualifiedSelector());
}

function findElement() {
  return window.find(this.qualifiedSelector());
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
  buildPageObjectAttribute: function(key, page) {
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
