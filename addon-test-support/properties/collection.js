/* global Symbol */
import Ceibo from 'ceibo';
import { buildSelector, isPageObject, getPageObjectDefinition } from '../-private/helpers';
import { create } from '../create';
import { count } from './count';
import { throwBetterError } from "../-private/better-errors";

/**
 * Creates a enumerable that represents a collection of items. The collection is zero-indexed
 * and has the following public methods and properties:
 *
 * - `length` - The number of items in the collection.
 * - `objectAt()` - Returns the page for the item at the specified index.
 * - `filter()` - Filters the items in the array and returns the ones which match the predicate function.
 * - `filterBy()` - Filters the items of the array by the specified property, returning all that are truthy or that match an optional value.
 * - `forEach()` - Runs a function for each item in the collection
 * - `map()` - maps over the elements of the collection
 * - `mapBy()` - maps over the elements of the collecton by the specified property
 * - `findOne()` - finds first item of the array with assert by specified function
 * - `findOneBy()` - finds first item of the array with assert by property
 * - `toArray()` - returns an array containing all the items in the collection
 * - `[Symbol.iterator]()` - if supported by the environment, this allows the collection to be iterated with `for/of` and spread with `...` like a normal array
 *
 * @example
 *
 * // <table>
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
 * import { create, collection, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   users: collection('table tr', {
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 })
 *   })
 * });
 *
 * assert.equal(page.users.length, 2);
 * assert.equal(page.users.objectAt(1).firstName, 'John');
 * assert.equal(page.users.objectAt(1).lastName, 'Doe');
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
 * import { create, collection, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.admins',
 *
 *   users: collection('table tr', {
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 })
 *   })
 * });
 *
 * assert.equal(page.users.length, 2);
 *
 * @example
 *
 * // <table>
 * //   <caption>User Index</caption>
 * //   <tbody>
 * //     <tr>
 * //         <td>Mary<td>
 * //         <td>Watson</td>
 * //       </tr>
 * //       <tr>
 * //         <td>John<td>
 * //         <td>Doe</td>
 * //       </tr>
 * //   </tbody>
 * // </table>
 *
 * import { create, collection, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: 'table',
 *
 *   users: collection('tr', {
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 }),
 *   })
 * });
 *
 * let john = page.users.filter((item) => item.firstName === 'John' )[0];
 * assert.equal(john.lastName, 'Doe');
 *
 * @example
 * <caption>If the browser you run tests [supports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility) Proxy, you can use array accessors to access elements by index</caption>
 *
 * // <table>
 * //   <tr>
 * //       <td>Mary<td>
 * //   </tr>
 * //   <tr>
 * //     <td>John<td>
 * //   </tr>
 * // </table>
 *
 * import { create, collection } from 'ember-cli-page-object';
 *
 * const page = create({
 *   users: collection('tr')
 * });
 *
 * // This only works on browsers that support `Proxy`
 * assert.equal(page.users[0].text, 'Mary');
 * assert.equal(page.users[1].text, 'John');
 *
 *
 * @param {String} scopeOrDefinition - Selector to define the items of the collection
 * @param {Object} [definitionOrNothing] - Object with the definition of item properties
 * @param {boolean} definition.resetScope - Override parent's scope
 * @return {Descriptor}
 */
export function collection(scope, definition) {
  if (typeof scope !== 'string') {
    throw new Error('collection requires `scope` as the first argument');
  }

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

      let finalizedDefinition = { ...definition };

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

  filterBy(propertyKey, value) {
    return this.toArray().filter((i) => {
      if (typeof value !== 'undefined') {
        return i[propertyKey] === value;
      } else {
        return Boolean(i[propertyKey]);
      }
    });
  }

  forEach(...args) {
    return this.toArray().forEach(...args);
  }

  map(...args) {
    return this.toArray().map(...args);
  }

  mapBy(propertyKey) {
    return this.toArray().map((i) => {
      return i[propertyKey];
    });
  }

  findOneBy(...args) {
    const elements = this.filterBy(...args);
    this._assertFoundElements(elements, ...args);
    return elements[0];
  }

  findOne(...args) {
    const elements = this.filter(...args);
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

    let array = [];

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
