import Ember from 'ember';
import Ceibo from 'ceibo';

var { $, assert } = Ember;

class Selector {
  constructor(node, scope, selector, filters) {
    this.targetNode = node;
    this.targetScope = scope || '';
    this.targetSelector = selector || '';
    this.targetFilters = filters;
  }

  toString() {
    var scope,
        filters;

    if (this.targetFilters.resetScope) {
      scope = this.targetScope;
    } else {
      scope = this.calculateScope(this.targetNode, this.targetScope);
    }

    filters = this.calculateFilters(this.targetFilters);

    return $.trim(`${scope} ${this.targetSelector}${filters}`);
  }

  calculateFilters() {
    var filters = [];

    if (this.targetFilters.contains) {
      filters.push(`:contains("${this.targetFilters.contains}")`);
    }

    if (typeof this.targetFilters.at === 'number') {
      filters.push(`:eq(${this.targetFilters.at})`);
    } else if (this.targetFilters.last) {
      filters.push(':last');
    }

    return filters.join('');
  }

  calculateScope(node, targetScope) {
    var scopes = this.getScopes(node);

    scopes.reverse();
    scopes.push(targetScope);

    return $.trim(scopes.join(' '));
  }

  getScopes(node) {
    var scopes = [];

    if (node.scope) {
      scopes.push(node.scope);
    }

    if (!node.resetScope && Ceibo.parent(node)) {
      scopes = scopes.concat(this.calculateScope(Ceibo.parent(node)));
    }

    return scopes;
  }
}

function guardMultiple(items, selector, supportMultiple) {
  assert(
    `"${selector}" matched more than one element. If this is not an error use { multiple: true }`,
    supportMultiple || items.length <= 1
  )
}

/**
 * Creates a fully qualified selector
 *
 * @param {Ceibo} node - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @return {string} Full qualified selector
 */
export function buildSelector(node, targetSelector, options) {
  return (new Selector(node, options.scope, targetSelector, options)).toString();
}

/**
 * Return a jQuery element or raise an exception if the element doesn't exist
 *
 * @param {Ceibo} node - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @return {Object} jQuery object
 */
export function findElementWithAssert(node, targetSelector, options = {}) {
  var selector = buildSelector(node, targetSelector, options);
  var result = findWithAssert(selector);

  guardMultiple(result, selector, options.multiple);

  return result;
}

/**
 * Return a jQuery element (can be an empty jQuery result)
 *
 * @param {Ceibo} node - Node of the tree
 * @param {string} targetSelector - Specific CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @return {Object} jQuery object
 */
export function findElement(node, targetSelector, options = {}) {
  var selector = buildSelector(node, targetSelector, options);
  var result = find(selector);

  guardMultiple(result, selector, options.multiple);

  return result;
}

/**
 * Trim whitespaces at both ends and normalize whitespaces inside `text`
 *
 * Due to variations in the HTML parsers in different browsers, the text
 * returned may vary in newlines and other white space.
 *
 * @see http://api.jquery.com/text/
 */
export function normalizeText(text) {
  return $.trim(text).replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
}

export function every(jqArray, cb) {
  var arr = jqArray.get();

  return Ember.A(arr).every(function(element) {
    return cb($(element));
  });
}

export function map(jqArray, cb) {
  var arr = jqArray.get();

  return Ember.A(arr).map(function(element) {
    return cb($(element));
  });
}
