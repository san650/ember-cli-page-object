/* global Symbol */
import Ember from 'ember';
import { buildSelector, assign } from '../../helpers';
import { create } from '../../create';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../../better-errors';
import { count } from '../count';
import Ceibo from 'ceibo';

export class Collection {
  constructor(definition, parent, key) {
    this.definition = definition;
    this.parent = parent;
    this.key = key;

    this._itemCounter = create({
      count: count(definition.scope, {
        resetScope: definition.resetScope,
        testContainer: definition.testContainer
      })
    }, { parent });

    this._items = [];
  }

  get length() {
    return this._itemCounter.count;
  }

  objectAt(index) {
    if (typeof this._items[index] === 'undefined') {
      let { definition, parent, key } = this;
      let scope = buildSelector({}, definition.scope, { at: index });

      let finalizedDefinition = assign({}, definition);

      finalizedDefinition.scope = scope;

      let tree = create(finalizedDefinition, { parent });

      // Change the key of the root node
      Ceibo.meta(tree).key = `${key}[${index}]`;

      this._items[index] = tree;
    }

    let itemPage = this._items[index];

    if (index > this.length - 1) {
      throwBetterError(
        itemPage,
        null,
        ELEMENT_NOT_FOUND,
        { selector: itemPage.scope }
      );
    }

    return itemPage;
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

  toArray() {
    let { length } = this;

    let array = Ember.A();

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
  }
}

export function collection(definition) {
  let descriptor = {
    isDescriptor: true,

    setup(node, key) {
      // Set the value on the descriptor so that it will be picked up and applied by Ceibo.
      // This does mutate the descriptor, but because `setup` is always called before the
      // value is assigned we are guaranteed to get a new, unique Collection instance each time.
      descriptor.value = new Collection(definition, node, key);
    }
  };

  return descriptor;
}
