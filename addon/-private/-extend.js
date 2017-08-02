import { create } from './create';
import { assign } from './helpers';

export function extend(...definitions) {
  const mergedDefinitions = assign({}, ...definitions);

  return {

    // TODO: Change API to create-compatible
    create(properties) {
      const mergedProperties = assign({}, mergedDefinitions, properties);
      return create(mergedProperties);
    },

  };
}
