/* global Symbol */
import { A } from '@ember/array';
import { buildSelector, assign as mergeFunction } from '../../-private/helpers';
import { create } from '../../create';
import { count } from '../count';
import Ceibo from 'ceibo';

const arrayDelegateMethods = ['map', 'filter', 'mapBy', 'filterBy', 'forEach'];

function merge(target, ...objects) {
  objects.forEach((o) => mergeFunction(target, o));

  return target;
}

function generateEnumerable(node, definition, item, key) {
  let enumerable = merge({}, definition);

  if (typeof (enumerable.count) === 'undefined') {
    enumerable.count = count(item.itemScope);
  }

  if (typeof (enumerable.toArray) === 'undefined') {
    enumerable.toArray = toArrayMethod(node, item, key);
    arrayDelegateMethods.forEach((method) => delegateToArray(enumerable, method));
  }

  let collection = create(enumerable, { parent: node });

  if (typeof (Symbol) !== 'undefined' && Symbol.iterator) {
    collection[Symbol.iterator] = iteratorMethod;
  }

  // Change the key of the root node
  Ceibo.meta(collection).key = `${key}()`;

  return collection;
}

function generateItem(node, index, definition, key) {
  let filters = merge({}, { scope: definition.scope, at: index });
  let scope = buildSelector({}, definition.itemScope, filters);

  let tree = create(
    merge(
      {
        testContainer: definition.testContainer
      },
      definition.item,
      {
        scope,
        resetScope: definition.resetScope
      }
    ), { parent: node });

  // Change the key of the root node
  Ceibo.meta(tree).key = `${key}(${index})`;

  return tree;
}

function toArrayMethod(node, definition, key) {
  return function() {
    let array = A();
    let index;
    let count;

    for (index = 0, count = this.count; index < count; index++) {
      array.push(generateItem(node, index, definition, key));
    }

    return array;
  };
}

function delegateToArray(enumerable, method) {
  if (typeof (enumerable[method]) === 'undefined') {
    enumerable[method] = function(...args) {
      return this.toArray()[method](...args);
    };
  }
}

function iteratorMethod() {
  let i = 0;
  let items = this.toArray();
  let next = () => ({ done: i >= items.length, value: items[i++] });

  return { next };
}

export function collection(definition) {
  definition = mergeFunction({}, definition);

  let item = {
    scope: definition.scope,
    itemScope: definition.itemScope,
    resetScope: definition.resetScope,
    item: definition.item,
    testContainer: definition.testContainer
  };

  delete definition.item;
  delete definition.itemScope;

  return {
    isDescriptor: true,

    get(key) {
      return (index) => {
        if (typeof (index) === 'number') {
          return generateItem(this, index, item, key);
        } else {
          return generateEnumerable(this, definition, item, key);
        }
      };
    }
  };
}
