/* global wait */
import Ember from 'ember';
import isHidden from './properties/is-hidden';
import isVisible from './properties/is-visible';
import clickOnText from './properties/click-on-text';
import clickable from './properties/clickable';
import contains from './properties/contains';
import text from './properties/text';

const { $ } = Ember;

function Node() {
  this.isHidden = isHidden().propertyFor(this, 'isHidden');
  this.isVisible = isVisible().propertyFor(this, 'isVisible');
  this.clickOn = clickOnText().propertyFor(this, 'clickOn');
  this.click = clickable().propertyFor(this, 'click');
  this.contains = contains().propertyFor(this, 'contains');
  this.text = text().propertyFor(this, 'text');
}

Node.prototype.then = function() {
  return wait().then(...arguments);
};

Node.prototype.toFunction = function() {
  let tmp = buildPageObject(this);

  return function() {
    return tmp;
  };
};

/**
 * Converts properties of type `component` to plain objects (`component` is
 * mantained for backwards compatibility)
 *
 * @param [Object] definition - The definition to pre-process
 * @return [Object] A new pre-processed representation of definition
 */
function preProcess(definition) {
  let node = {},
      keys = Object.keys(definition);

  keys.forEach(function(key) {
    let attr = definition[key];

    if (attr && attr.unfoldPageObjectDefinition) {
      attr = attr.unfoldPageObjectDefinition();
    }

    if ($.isPlainObject(attr)) {
      node[key] = preProcess(attr);
    } else {
      node[key] = attr;
    }
  });

  return node;
}

function setScopes(definition) {
  let keys = Object.keys(definition);

  keys.forEach(function(key) {
    let attr = definition[key];

    if ($.isPlainObject(attr)) {

      if (definition.__forceScopeToChildren) {
        attr.scope = [definition.scope, attr.scope].join(' ');
      } else if (typeof(attr.scope) === 'undefined' && typeof(definition.scope) !== 'undefined') {
        attr.scope = definition.scope;
      }

      setScopes(attr);
    }
  });

  return definition;
}

/**
 * Creates a tree of `Node`s and `Property`s
 *
 * @param [Object] definition - The definition of the page object
 * @return [Node] A new tree representation of the page object
 */
function buildTree(definition) {
  let keys = Object.keys(definition),
      root = new Node();

  keys.forEach(function(key) {
    let attr = definition[key];

    if (typeof attr === 'undefined') {
      // continue
    } else if (attr.propertyFor) {
      root[key] = attr.propertyFor(root, key);
    } else if ($.isPlainObject(attr)) {
      root[key] = buildTree(attr);
    } else {
      root[key] = attr;
    }
  });

  return root;
}

/**
 * Makes everything invokable (toFunction) but keeps a reference to the tree
 * structure to allow instrospection.
 *
 * @param [Node] definition - The page object definition
 * @return [Node] The representation of the page object
 */
function buildPageObject(definition) {
  let keys = Object.keys(definition);

  keys.forEach(function(key) {
    let attr = definition[key];

    if (typeof attr === 'undefined') {
      // continue
    } else if (attr.toFunction) {
      definition[key] = attr.toFunction();
    } else {
      definition[key] = attr;
    }
  });

  return definition;
}

export function create(definition) {
  let copy;

  copy = preProcess(definition);
  copy = setScopes(copy);
  copy = buildTree(copy);
  copy = buildPageObject(copy);

  return copy;
}

export function build(definition) {
  Ember.deprecate('`build` is deprecated in favor of `create`.');

  return create(definition);
}
