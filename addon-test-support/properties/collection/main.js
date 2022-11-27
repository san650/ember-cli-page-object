/* global Symbol */
import { A } from '@ember/array';
import { buildSelector, isPageObject, getPageObjectDefinition } from '../../-private/helpers';
import { create } from '../../create';
import { count } from '../count';
import Ceibo from 'ceibo';
import { throwBetterError } from "../../-private/better-errors";

export class Collection {
  constructor(scope, definition, parent, key) {
    this.scope = scope;
    this.definition = definition || {};
    this.parent = parent;
    this.key = key;

    this._itemCounter = create({
      count: count(scope, {
        resetScope: this.definition.resetScope,
        testContainer: this.definition.testContainer
      })
    }, { parent });

    this._items = [];
  }

  get length() {
    return this._itemCounter.count;
  }

  objectAt(index) {
    let { key } = this;

    if (typeof this._items[index] === 'undefined') {
      let { scope, definition, parent } = this;
      let itemScope = buildSelector({}, scope, { at: index });

      let finalizedDefinition = Object.assign({}, definition);

      finalizedDefinition.scope = itemScope;

      let tree = create(finalizedDefinition, { parent });

      // Change the key of the root node
      Ceibo.meta(tree).key = `${key}[${index}]`;

      this._items[index] = tree;
    }

    return this._items[index];
  }

  filter(...args) {
    return this.toArray().filter(...args);
  }

  filterBy(...args) {
    return this.toArray().filterBy(...args);
  }

  forEach(...args) {
    return this.toArray().forEach(...args);
  }

  map(...args) {
    return this.toArray().map(...args);
  }

  mapBy(...args) {
    return this.toArray().mapBy(...args);
  }

  findOneBy(...args) {
    const elements = this.toArray().filterBy(...args);
    this._assertFoundElements(elements, ...args);
    return elements[0];
  }

  findOne(...args) {
    const elements = this.toArray().filter(...args);
    this._assertFoundElements(elements, ...args);
    return elements[0];
  }

  _assertFoundElements(elements, ...args) {
    const argsToText = args.length === 1 ? 'condition': `${args[0]}: "${args[1]}"`;
    if (elements.length > 1) {
      throwBetterError(
        this.parent,
        this.key,
        `${elements.length} elements found by ${argsToText}, but expected 1`
      );
    }

    if (elements.length === 0) {
      throwBetterError(this.parent, this.key, `cannot find element by ${argsToText}`);
    }
  }

  toArray() {
    let { length } = this;

    let array = A();

    for (let i = 0; i < length; i++) {
      array.push(this.objectAt(i));
    }

    return array;
  }
}

if (typeof (Symbol) !== 'undefined' && Symbol.iterator) {
  Collection.prototype[Symbol.iterator] = function() {
    let i = 0;
    let items = this.toArray();
    let next = () => ({ done: i >= items.length, value: items[i++] });

    return { next };
  };
}

function proxyIfSupported(instance) {
  if (window.Proxy) {
    return new window.Proxy(instance, {
      get: function (target, name) {
        if (typeof (name) === 'number' || typeof (name) === 'string') {
          let index = parseInt(name, 10);

          if (!isNaN(index)) {
            return target.objectAt(index);
          }
        }

        return target[name];
      }
    });
  } else {
    return instance;
  }
}

export function collection(scope, definition) {

  if(isPageObject(definition)){
    //extract the stored definition from the page object
    definition = getPageObjectDefinition(definition);
  }
  let descriptor = {
    isDescriptor: true,

    setup(node, key) {
      // Set the value on the descriptor so that it will be picked up and applied by Ceibo.
      // This does mutate the descriptor, but because `setup` is always called before the
      // value is assigned we are guaranteed to get a new, unique Collection instance each time.
      descriptor.value = proxyIfSupported(new Collection(scope, definition, node, key));
    }
  };

  return descriptor;
}
