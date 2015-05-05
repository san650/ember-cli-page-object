import { build } from './page-object/build';
import { hasClass, notHasClass, isVisible, isHidden } from './page-object/predicates';
import { attribute, count, text, value } from './page-object/queries';
import { clickable, fillable, visitable } from './page-object/actions';
import { collection } from './page-object/collection';

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
