import {
  build,
  componentAttribute
} from './page-object/build';
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
  visitableAttribute
} from './page-object/actions';
import { collection } from './page-object/collection';
import { customHelper } from './page-object/custom-helper';
import clickable from './page-object/properties/clickable';
import clickOnText from './page-object/properties/click-on-text';
import fillable from './page-object/properties/fillable';

export default {
  attribute:   attributeAttribute,
  build,
  clickable,
  clickOnText,
  customHelper,
  collection,
  component:   componentAttribute,
  count:       countAttribute,
  fillable,
  hasClass:    hasClassAttribute,
  isHidden:    isHiddenAttribute,
  isVisible:   isVisibleAttribute,
  notHasClass: notHasClassAttribute,
  selectable:  fillable,
  text:        textAttribute,
  value:       valueAttribute,
  visitable:   visitableAttribute
};
