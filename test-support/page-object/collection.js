import Ember from 'ember';
import { build } from './build';
import { countAttribute } from './queries';
import {
  isNullOrUndefined,
  qualifySelector
} from './helpers';

let extend = Ember.$.extend;

function shallowCopyAndExtend(...objects) {
  return extend({}, ...objects);
}

function scopeWithIndex(base, index) {
  return `${base}:nth-of-type(${index})`;
}

function plugAttribute(definition, attributeName, attributeDefinition, ...attributeParams) {
  if (isNullOrUndefined(definition[attributeName])) {
    definition[attributeName] = attributeDefinition(...attributeParams);
  }
}

function extract(object, name) {
  let attribute = object[name];

  delete object[name];

  return attribute;
}

export function collection(def) {
  return {
    buildPageObjectAttribute: function(key, parent) {
      let itemComponent,
          itemScope,
          collectionScope,
          collectionComponent,
          definition = shallowCopyAndExtend(def);

      itemComponent = extract(definition, 'item');
      itemScope = extract(definition, 'itemScope');

      if (isNullOrUndefined(definition.scope)) {
        collectionScope = parent.scope;
      } else {
        collectionScope = definition.scope;
      }

      // Add count attribute
      plugAttribute(definition, 'count', countAttribute, qualifySelector(collectionScope, itemScope));

      collectionComponent = build(definition, key, parent);

      return function(index) {
        let component;

        if (index) {
          component = build(
            shallowCopyAndExtend(
              itemComponent,
              { scope: qualifySelector(collectionScope, scopeWithIndex(itemScope, index)) }
            ),
            key,
            parent
          );
        } else {
          component = collectionComponent;
        }

        return component;
      };
    }
  };
}
