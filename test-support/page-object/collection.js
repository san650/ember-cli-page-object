import Ember from 'ember';
import { buildSelector } from '../helpers';
import { create } from '../create';
import { count } from './count';

function merge(target, ...objects) {
  objects.forEach(function(o) {
    Ember.merge(target, o);
  });

  return target;
}

function generateEnumerable(definition) {
  var enumerable = merge({}, definition);

  delete enumerable.itemScope;

  if (typeof enumerable.count === 'undefined') {
    enumerable.count = count(definition.itemScope)
  }

  return create(enumerable);
}

function generateItem(index, definition) {
  var filters = merge({}, { scope: definition.scope, at: index });
  var scope = buildSelector({}, definition.itemScope, filters);

  return create(merge({}, definition.item, { scope, resetScope: definition.resetScope }), { parent: this });
}

/**
 * Creates a component that represents a collection of items, the collection is zero-indexed
 *
 * The collection component behaves as a regular PageObject when called without index (parens needed)
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
 * var page = PageObject.create({
 *   users: collection({
 *     itemScope: 'table tr',
 *
 *     item: {
 *       firstName: text('td', { at: 0 })
 *       lastName: text('td', { at: 1 })
 *     }
 *   })
 * });
 *
 * assert.equal(page.users().count, 2);
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
 * var page = PageObject.create({
 *   users: collection({
 *     scope: '.admins',
 *
 *     itemScope: 'table tr',
 *
 *     item: {
 *       firstName: text('td', { at: 0 })
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
 * var page = PageObject.create({
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
 * assert.equal(page.users().caption, "User Index");
 *
 * @param {Object} definition - Collection definition
 * @param {string} definition.scope - Nests provided scope with parent's scope
 * @param {boolean} definition.resetScope - Override parent's scope
 * @param {String} definition.itemScope - CSS selector
 * @param {Object} definition.item - Item definition
 * @return {Descriptor}
 */
export function collection(definition) {
  return {
    isDescriptor: true,

    value(index) {
      if (typeof index === 'number') {
        return generateItem.call(this, index, definition);
      } else {
        return generateEnumerable.call(this, definition);
      }
    }
  };
}
