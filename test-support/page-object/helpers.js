import Ember from 'ember';
import Ceibo from './ceibo';

var { trim } = Ember.$;

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

    return trim(`${scope} ${this.targetSelector}${filters}`);
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
 * @return {string} Full qualified selector
 */
export function findElementWithAssert(node, targetSelector, options) {
  var selector = buildSelector(node, targetSelector, options);

  return findWithAssert(selector);
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
 * @return {string} Full qualified selector
 */
export function findElement(node, targetSelector, options) {
  var selector = buildSelector(node, targetSelector, options);

  return find(selector);
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
  return Ember.$.trim(text).replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
}
