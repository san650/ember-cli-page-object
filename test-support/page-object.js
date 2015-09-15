import {
  build,
  componentAttribute
} from './page-object/build';
import {
  attributeAttribute,
  countAttribute,
  textAttribute,
  valueAttribute
} from './page-object/queries';
import { collection } from './page-object/collection';
import { customHelper } from './page-object/custom-helper';
import clickable from './page-object/properties/clickable';
import clickOnText from './page-object/properties/click-on-text';
import fillable from './page-object/properties/fillable';
import visitable from './page-object/properties/visitable';
import hasClass from './page-object/properties/has-class';
import notHasClass from './page-object/properties/not-has-class';
import isVisible from './page-object/properties/is-visible';
import isHidden from './page-object/properties/is-hidden';

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
  hasClass,
  isHidden,
  isVisible,
  notHasClass,
  selectable:  fillable,
  text:        textAttribute,
  value:       valueAttribute,
  visitable
};
