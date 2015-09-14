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
  clickOnTextAttribute,
  fillableAttribute,
  visitableAttribute
} from './page-object/actions';
import { collection } from './page-object/collection';
import { customHelper } from './page-object/custom-helper';
import clickable from './page-object/properties/clickable';

export default {
  attribute:   attributeAttribute,
  build,
  clickable,
  clickOnText: clickOnTextAttribute,
  customHelper,
  collection,
  component:   componentAttribute,
  count:       countAttribute,
  fillable:    fillableAttribute,
  hasClass:    hasClassAttribute,
  isHidden:    isHiddenAttribute,
  isVisible:   isVisibleAttribute,
  notHasClass: notHasClassAttribute,
  selectable:  fillableAttribute,
  text:        textAttribute,
  value:       valueAttribute,
  visitable:   visitableAttribute
};
