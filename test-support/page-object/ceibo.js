function merge(target, source) {
  for (var attr in source) {
    target[attr] = source[attr];
  }

  return target;
}

/**
 * Extends Ember.typeOf to add the type 'descriptor'
 *
 */
function typeOf(item) {
  if (item && item.isDescriptor) {
    return 'descriptor';
  }

  return typeof(item);
}

function defineProperty(target, keyName, value, getter) {
  var options = {
    configurable: true,
    enumerable: true,
  };

  if (typeOf(getter) !== 'undefined') {
    options.get = getter;
  } else {
    options.writable = false;
    options.value = value;
  }

  Object.defineProperty(target, keyName, options);
}

function buildDescriptor(treeBuilder, target, key, attr) {
  if (typeof attr.setup === 'function') {
    attr.setup(target, key);
  }

  defineProperty(target, key, attr.value, attr.get);
}

function buildObject(treeBuilder, target, key, attr) {
  var object = {};

  // Create child component
  defineProperty(target, key, object);

  // Recursion
  treeBuilder.processNode(attr, object, target);
}

function buildDefault(treeBuilder, target, key, attr) {
  defineProperty(target, key, attr);
}

function TreeBuilder(definition, builders) {
  this.definition = definition;
  this.builders = builders;
}

function setParent(target, parent) {
  if (parent) {
    Object.defineProperty(target, '__parentTreeNode', { value: parent, configurable: true });
  } else {
    delete target['__parentTreeNode'];
  }
}

function parent(object) {
  if (typeof object === 'object') {
    return object['__parentTreeNode'];
  }
}

TreeBuilder.prototype = {
  builderFor(value) {
    return this.builders[typeOf(value)] || this.builders['default'];
  },

  build(parentTree) {
    var root = {},
      node;

    this.processNode({ root: this.definition }, root);

    node = root['root'];
    setParent(node, parentTree);

    return node;
  },

  processNode(definition, target, parent) {
    var keys = Object.keys(definition);

    keys.forEach(key => {
      var attr = definition[key],
        builder;

      builder = this.builderFor(attr);
      builder(this, target, key, attr);
    });

    setParent(target, parent);

    return target;
  }
};

const DEFAULT_BUILDERS = {
  descriptor: buildDescriptor,
  object: buildObject,
  default: buildDefault
};

export default {
  defineProperty,

  create(definition, options) {
    options = options || {};

    var builder = merge(merge({}, DEFAULT_BUILDERS), options.builder);

    return new TreeBuilder(definition, builder).build(options.parent);
  },

  parent(node) {
    return parent(node);
  }
};
