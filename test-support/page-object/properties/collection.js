import Ember from 'ember';
import Ceibo from 'ceibo';
import { buildSelector } from '../helpers';
import { create } from '../create';
import { count } from './count';

function merge(target, ...objects) {
  objects.forEach(o => Ember.merge(target, o));

  return target;
}

function generateEnumerable(definition) {
  var enumerable = merge({}, definition);

  delete enumerable.itemScope;

  if (typeof enumerable.count === 'undefined') {
    enumerable.count = count(definition.itemScope)
  }

  return create(enumerable, { parent: this });
}

function generateItem(index, definition) {
  var filters = merge({}, { scope: definition.scope, at: index });
  var scope = buildSelector({}, definition.itemScope, filters);

  return create(merge({}, definition.item, { scope, resetScope: definition.resetScope }), { parent: this });
}

/**
 * Creates a component that represents a collection of items
 *
 * @example
 *
 *   var page = PageObject.create({
 *     users: collection({
 *       itemScope: 'table tr',
 *
 *       item: {
 *         firstName: text('td', { at: 0 })
 *         lastName: text('td', { at: 1 })
 *       }
 *   });
 *
 *   assert.equal(page.users().count(), 2);
 *   assert.equal(page.users(1).firstName, 'John');
 *   assert.equal(page.users(1).lastName, 'Doe');
 *
 * @param {Object} definition - Collection definition
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
