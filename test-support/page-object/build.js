/* global wait */
import componentProperty from './properties/component';

function Node() {
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
      keys = Object.keys(definition),
      attr;

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
  let keys = Object.keys(definition),
      attr;

  keys.forEach(function(key) {
    let attr = definition[key];

    if ($.isPlainObject(attr)) {

      if (typeof attr.scope === 'undefined' && typeof definition.scope !== 'undefined') {
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
  let keys = Object.keys(definition),
      tmp;

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

export function build(definition) {
  let copy;

  copy = preProcess(definition);
  copy = setScopes(copy);
  copy = buildTree(copy);
  copy = buildPageObject(copy);

  return copy;
}
