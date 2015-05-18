import Ember from 'ember';
import { build } from './build';
import { countAttribute } from './queries';

let extend = Ember.$.extend;

function shallowCopyAndExtend(...objects) {
  return extend({}, ...objects);
}

function scopeWithIndex(base, index) {
  return `${base}:nth-of-type(${index})`;
}

function plugAttribute(definition, attributeName, attributeDefinition, ...attributeParams) {
  if (definition[attributeName] === undefined) {
    definition[attributeName] = attributeDefinition(...attributeParams);
  }
}

function extract(object, name) {
  let attribute = object[name];

  delete object[name];

  return attribute;
}

export function collection(definition) {
  return {
    buildPageObjectAttribute: function(/*key, parent*/) {
      let itemComponent,
          itemScope,
          collectionComponent;

      itemComponent = extract(definition, 'item');
      itemScope = extract(definition, 'itemScope');

      // Add count attribute
      plugAttribute(definition, 'count', countAttribute, itemScope);

      collectionComponent = build(definition);

      return function(index) {
        let component;

        if (index) {
          component = build(shallowCopyAndExtend(itemComponent, { scope: scopeWithIndex(itemScope, index) }));
        } else {
          component = collectionComponent;
        }

        return component;
      };
    }
  };
}
