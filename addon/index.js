import { build } from './build';
import { hasClass, notHasClass, isVisible, isHidden } from './predicates';
import { attribute, count, text, value } from './queries';
import { clickable, fillable, visitable } from './actions';
import { collection } from './collection';

function component(definition) {
  return {
    build: function(/*key, parent*/) {
      let component = build(definition);

      return function() {
        return component;
      };
    }
  };
}

export default {
  attribute,
  build,
  clickable,
  collection,
  component,
  count,
  fillable,
  hasClass,
  isHidden,
  isVisible,
  notHasClass,
  text,
  value,
  visitable
};
