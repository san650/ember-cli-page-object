export { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import Ceibo from 'ceibo';
import { deprecate } from '@ember/application/deprecations';
import { getContext as getEmberTestHelpersContext } from './compatibility';

import $ from '-jquery';

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

    filters = this.calculateFilters(this.targetFilters);

    let selector = $.trim(`${scope} ${this.targetSelector}${filters}`);

    if (!selector.length) {
      // When an empty selector is resolved take the first direct child of the
      // testing container.
      selector = ':first';
    }

    deprecate(
      'Usage of comma separated selectors is deprecated in ember-cli-page-object', selector.indexOf(',') === -1, {
        id: 'ember-cli-page-object.comma-separated-selectors',
        until: "2.0.0",
        url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#comma-separated-selectors',
      }
    );

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

    return $.trim(scopes.join(' '));
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
  assert(
    `"${selector}" matched more than one element. If you want to select many elements, use collections instead.`,
    supportMultiple || items.length <= 1
  );
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
  return (new Selector(node, options.scope, targetSelector, options)).toString();
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

/**
 * @public
 *
 * Return a test context if one was provided during `create()` or via `setContext()`
 *
 * @param {Ceibo} node - Node of the tree
 * @return {Object} `moduleForComponent` test's `this` context, or null
 */
export function getContext(node) {
  let root = getRoot(node);
  let { context } = root;

  if (typeof context === 'object' && context !== null && typeof context.$ === 'function') {
    return context;
  }

  context = getEmberTestHelpersContext();
  if (typeof context === 'object' && context !== null && typeof context.$ === 'function' && !context.element) {
    return context
  }

  return null;
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

/**
 * @public
 *
 * Returns a boolean indicating whether an object contains a given property.
 * The path to a nested property should be indicated by a dot-separated string.
 *
 * @param {Object} object - object to check for the target property
 * @param {string} pathToProp - dot-separated path to property
 * @return {Boolean}
 */
export function objectHasProperty(object, pathToProp) {
  const pathSegments = pathToProp.split('.');

  for (let i = 0; i < pathSegments.length; i++) {
    const key = pathSegments[i];
    if (object === null || object === undefined || !object.hasOwnProperty(key)) {
      return false;
    } else {
      object = object[key];
    }
  }

  return true;
}

/**
 * @public
 *
 * Returns the value of an object property. If the property is a function,
 * the return value is that function bound to its "owner."
 *
 * @param {Object} object - object on which to look up the target property
 * @param {string} pathToProp - dot-separated path to property
 * @return {Boolean|String|Number|Function|Null|Undefined} - value of property
 */
export function getProperty(object, pathToProp) {
  const pathSegments = pathToProp.split('.');

  if (pathSegments.length === 1) {
    const value = get(object, pathToProp);
    return typeof value === 'function' ? value.bind(object) : value;
  }

  const pathToPropOwner = pathSegments.slice(0, -1).join('.');
  const propOwner = get(object, pathToPropOwner);

  if (propOwner === null || propOwner === undefined) {
    return undefined;
  }

  const propKey = pathSegments[pathSegments.length - 1];
  const value = get(propOwner, propKey);

  return typeof value === 'function' ? value.bind(propOwner) : value;
}

export function isPageObject(property){
  if(property && typeof(property) === 'object'){
    let meta = Ceibo.meta(property);
    return (meta && meta.__poDef__)
  } else{
    return false;
  }
}

export function getPageObjectDefinition(node){
  if(!isPageObject(node)){
    throw new Error('cannot get the page object definition from a node that is not a page object');
  }else{
    return Ceibo.meta(node).__poDef__;
  }
}

export function storePageObjectDefinition(node, definition){
  Ceibo.meta(node).__poDef__ = definition;
}
