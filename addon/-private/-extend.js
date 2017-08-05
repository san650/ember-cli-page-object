import Ember from 'ember';
import { create } from './create';
import { assign } from './helpers';

const {
  copy
} = Ember;

export function extend(originalDefinition) {
  const _extend = extend;

  return {
    create(definitionOrUrl, definitionOrOptions, optionsOrNothing) {
      let definition;
      let url;
      let options;

      if (typeof (definitionOrUrl) === 'string') {
        url = definitionOrUrl;
        definition = definitionOrOptions || {};
        options = optionsOrNothing || {};
      } else {
        url = false;
        definition = definitionOrUrl;
        options = definitionOrOptions || {};
      }

      const parentDefinition = copy(originalDefinition);
      const mergedDefinition = assign(parentDefinition, definition);

      return create(
        url || mergedDefinition,
        mergedDefinition || options,
        options
      );
    },

    extend(definition) {
      const parentDefinition = copy(originalDefinition);
      const mergedDefinition = assign(parentDefinition, definition);

      return _extend(mergedDefinition);
    }
  };
}
