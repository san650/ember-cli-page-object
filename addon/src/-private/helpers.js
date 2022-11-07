import Ceibo from '@ro0gr/ceibo';
import deprecate from './deprecate';
import { importSync } from '@embroider/macros';

let jQuery;

if (window.jQuery) {
  jQuery = window.jQuery;
} else {
  const jqueryImport = importSync('jquery');
  jQuery = jqueryImport.default;
}

export { jQuery as $ };

function isPresent(value) {
  return typeof value !== 'undefined';
}

class Selector {
  constructor(node, scope, selector, filters) {
    this.targetNode = node;
    this.targetScope = scope || '';
    this.targetSelector = selector || '';
    this.targetFilters = filters;
  }

  toString() {
    let scope;
    let filters;

    if (this.targetFilters.resetScope) {
      scope = this.targetScope;
    } else {
      scope = this.calculateScope(this.targetNode, this.targetScope);
    }

    if (`${scope} ${this.targetSelector}`.indexOf(',') > -1) {
      deprecate(
        'comma-separated-selectors',
        'Usage of comma separated selectors is deprecated in ember-cli-page-object',
        '1.16.0',
        '2.0.0'
      );
    }

    filters = this.calculateFilters(this.targetFilters);

    let selector = `${scope} ${this.targetSelector}${filters}`.trim();

    if (!selector.length) {
      // When an empty selector is resolved take the first direct child of the
      // testing container.
      selector = ':first';
    }

    return selector;
  }

  calculateFilters() {
    let filters = [];

    if (this.targetFilters.visible) {
      filters.push(`:visible`);
    }

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
    let scopes = this.getScopes(node);

    scopes.reverse();
    scopes.push(targetScope);

    return scopes.join(' ').trim();
  }

  getScopes(node) {
    let scopes = [];

    if (node.scope) {
      scopes.push(node.scope);
    }

    if (!node.resetScope && Ceibo.parent(node)) {
      scopes = scopes.concat(this.calculateScope(Ceibo.parent(node)));
    }

    return scopes;
  }
}

export function guardMultiple(items, selector, supportMultiple) {
  if (items.length > 1 && !supportMultiple) {
    throw new Error(
      `"${selector}" matched more than one element. If you want to select many elements, use collections instead.`
    );
  }
}

/**
 * @public
 *
 * Builds a CSS selector from a target selector and a PageObject or a node in a PageObject, along with optional parameters.
 *
 * @example
 *
 * const component = PageObject.create({ scope: '.component'});
 *
 * buildSelector(component, '.my-element');
 * // returns '.component .my-element'
 *
 * @example
 *
 * const page = PageObject.create({});
 *
 * buildSelector(page, '.my-element', { at: 0 });
 * // returns '.my-element:eq(0)'
 *
 * @example
 *
 * const page = PageObject.create({});
 *
 * buildSelector(page, '.my-element', { contains: "Example" });
 * // returns ".my-element :contains('Example')"
 *
 * @example
 *
 * const page = PageObject.create({});
 *
 * buildSelector(page, '.my-element', { last: true });
 * // returns '.my-element:last'
 *
 * @param {Ceibo} node - Node of the tree
 * @param {string} targetSelector - CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @return {string} Fully qualified selector
 */
export function buildSelector(node, targetSelector, options) {
  return new Selector(node, options.scope, targetSelector, options).toString();
}

/**
 * @public
 *
 * Return the root of a node's tree
 *
 * @param {Ceibo} node - Node of the tree
 * @return {Ceibo} node - Root node of the tree
 */
export function getRoot(node) {
  let parent = Ceibo.parent(node);
  let root = node;

  while (parent) {
    root = parent;
    parent = Ceibo.parent(parent);
  }

  return root;
}

function getAllValuesForProperty(node, property) {
  let iterator = node;
  let values = [];

  while (isPresent(iterator)) {
    if (isPresent(iterator[property])) {
      values.push(iterator[property]);
    }

    iterator = Ceibo.parent(iterator);
  }

  return values;
}

/**
 * @public
 *
 * Return full scope of node (includes all ancestors scopes)
 *
 * @param {Ceibo} node - Node of the tree
 * @return {string} Full scope of node
 */
export function fullScope(node) {
  let scopes = getAllValuesForProperty(node, 'scope');

  return scopes.reverse().join(' ');
}

/**
 * @public
 *
 * Returns the value of property defined on the closest ancestor of given
 * node.
 *
 * @param {Ceibo} node - Node of the tree
 * @param {string} property - Property to look for
 * @return {?Object} The value of property on closest node to the given node
 */
export function findClosestValue(node, property) {
  if (isPresent(node[property])) {
    return node[property];
  }

  let parent = Ceibo.parent(node);

  if (isPresent(parent)) {
    return findClosestValue(parent, property);
  }
}
