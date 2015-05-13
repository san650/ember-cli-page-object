import { build } from './build';

export function componentAttribute(definition) {
  return {
    buildPageObjectAttribute: function(/*key, parent*/) {
      let component = build(definition);

      return function() {
        return component;
      };
    }
  };
}
