import { build } from './page-object/build';
import {
  hasClassAttribute,
  notHasClassAttribute,
  isVisibleAttribute,
  isHiddenAttribute
} from './page-object/predicates';
import {
  attributeAttribute,
  countAttribute,
  textAttribute,
  valueAttribute
} from './page-object/queries';
import {
  clickableAttribute,
  fillableAttribute,
  visitableAttribute
} from './page-object/actions';
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
  attribute:   attributeAttribute,
  build,
  clickable:   clickableAttribute,
  collection,
  component,
  count:       countAttribute,
  fillable:    fillableAttribute,
  hasClass:    hasClassAttribute,
  isHidden:    isHiddenAttribute,
  isVisible:   isVisibleAttribute,
  notHasClass: notHasClassAttribute,
  text:        textAttribute,
  value:       valueAttribute,
  visitable:   visitableAttribute
};
