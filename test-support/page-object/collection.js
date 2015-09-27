import Ember from 'ember';
import { build } from './build';
import count from './properties/count';
import {
  isNullOrUndefined,
  qualifySelector
} from './helpers';

let extend = Ember.$.extend;

function shallowCopyAndExtend(...objects) {
  return extend({}, ...objects);
}

function scopeWithIndex(base, index) {
  return `${base}:eq(${index - 1})`;
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
    propertyFor: function(parent, key) {
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
      plugAttribute(definition, 'count', count, qualifySelector(collectionScope, itemScope));

      collectionComponent = build(definition, parent, key);

      return {
        toFunction() {
          return function(index) {
            let component;

            if (index === 0) {
              throw new Error('ember-cli-page-object collections are 1-based arrays. Use index 1 to access the first item.');
            }

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
  };
}
