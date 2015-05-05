import Ember from 'ember';
import { build } from './build';
import { count } from './queries';

let extend = Ember.$.extend;

function dynamicScope(base, index) {
  return `${base}:nth-of-type(${index})`;
}

export function collection(definition) {
  return {
    build: function(/*key, page*/) {
      let itemComponent,
          itemScope,
          collectionComponent;

      itemComponent = definition.item;
      itemScope = definition.itemScope;

      delete definition.item;
      delete definition.itemScope;

      // Add count attribute
      if (definition.count === undefined) {
        definition.count = count(itemScope);
      }

      collectionComponent = build(definition);

      return function(index) {
        let component;

        if (index) {
          component = build(extend({}, itemComponent, { scope: dynamicScope(itemScope, index) }));
        } else {
          component = collectionComponent;
        }

        return component;
      };
    }
  };
}
