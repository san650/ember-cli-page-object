import { build } from './build';

export function componentAttribute(definition) {
  return {
    build: function(/*key, parent*/) {
      let component = build(definition);

      return function() {
        return component;
      };
    }
  };
}
