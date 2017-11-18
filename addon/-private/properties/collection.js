/* global Symbol */
import Ember from 'ember';
import { buildSelector, assign as mergeFunction } from '../helpers';
import { create } from '../create';
import { count } from './count';
import Ceibo from 'ceibo';

const arrayDelegateMethods = ['map', 'filter', 'find', 'mapBy', 'filterBy', 'findBy', 'forEach'];

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
    let array = Ember.A();
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

/**
 * @public
 *
 * Creates a component that represents a collection of items. The collection is zero-indexed.
 *
 * When called with an index, the method returns the matching item.
 *
 * When called without an index, the the object returned behaves as a regular PageObject with a few additional properties and methods:
 *
 * - `count` - the number of items in the collection
 * - `toArray()` - returns an array containing all the items in the collection
 * - `[Symbol.iterator]()` - if supported by the environment, this allows the collection to be iterated with `for/of` and spread with `...` like a normal array
 *
 * Collection objects also delegate the following methods to `toArray()` for ease of consumption:
 * - `map`
 * - `mapBy`
 * - `filter`
 * - `filterBy`
 * - `forEach`
 *
 * @example
 *
 * // <table>
 * //   <caption>List of users</caption>
 * //   <tbody>
 * //     <tr>
 * //       <td>Mary<td>
 * //       <td>Watson</td>
 * //     </tr>
 * //     <tr>
 * //       <td>John<td>
 * //       <td>Doe</td>
 * //     </tr>
 * //   </tbody>
 * // </table>
 *
 * const page = PageObject.create({
 *   users: collection({
 *     itemScope: 'table tr',
 *
 *     item: {
 *       firstName: text('td', { at: 0 }),
 *       lastName: text('td', { at: 1 })
 *     },
 *
 *     caption: text('caption')
 *   })
 * });
 *
 * assert.equal(page.users().count, 2);
 * assert.equal(page.users().caption, 'List of users');
 * assert.equal(page.users(1).firstName, 'John');
 * assert.equal(page.users(1).lastName, 'Doe');
 *
 * @example
 *
 * // <div class="admins">
 * //   <table>
 * //     <tbody>
 * //       <tr>
 * //         <td>Mary<td>
 * //         <td>Watson</td>
 * //       </tr>
 * //       <tr>
 * //         <td>John<td>
 * //         <td>Doe</td>
 * //       </tr>
 * //     </tbody>
 * //   </table>
 * // </div>
 *
 * // <div class="normal">
 * //   <table>
 * //   </table>
 * // </div>
 *
 * const page = PageObject.create({
 *   users: collection({
 *     scope: '.admins',
 *
 *     itemScope: 'table tr',
 *
 *     item: {
 *       firstName: text('td', { at: 0 }),
 *       lastName: text('td', { at: 1 })
 *     }
 *   })
 * });
 *
 * assert.equal(page.users().count, 2);
 *
 * @example
 *
 * // <table>
 * //   <caption>User Index</caption>
 * //   <tbody>
 * //     <tr>
 * //       <td>Doe</td>
 * //     </tr>
 * //   </tbody>
 * // </table>
 *
 * const page = PageObject.create({
 *   users: PageObject.collection({
 *     scope: 'table',
 *     itemScope: 'tr',
 *
 *     item: {
 *       firstName: text('td', { at: 0 })
 *     },
 *
 *     caption: PageObject.text('caption')
 *   })
 * });
 *
 * assert.equal(page.users().caption, 'User Index');
 *
 * @param {Object} definition - Collection definition
 * @param {string} definition.scope - Nests provided scope within parent's scope
 * @param {boolean} definition.resetScope - Override parent's scope
 * @param {string} definition.itemScope - CSS selector
 * @param {Object} definition.item - Item definition
 * @return {Descriptor}
 */
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
