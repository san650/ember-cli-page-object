import {
  build,
  create
} from './page-object/create';
import { collection } from './page-object/collection';
import attribute from './page-object/properties/attribute';
import clickOnText from './page-object/properties/click-on-text';
import clickable from './page-object/properties/clickable';
import component from './page-object/properties/component';
import count from './page-object/properties/count';
import customHelper from './page-object/properties/custom-helper';
import fillable from './page-object/properties/fillable';
import hasClass from './page-object/properties/has-class';
import isHidden from './page-object/properties/is-hidden';
import isVisible from './page-object/properties/is-visible';
import notHasClass from './page-object/properties/not-has-class';
import text from './page-object/properties/text';
import textList from './page-object/properties/text-list';
import value from './page-object/properties/value';
import visitable from './page-object/properties/visitable';

export default {
  attribute,
  build,
  clickOnText,
  clickable,
  collection,
  component,
  count,
  create,
  customHelper,
  fillable,
  hasClass,
  isHidden,
  isVisible,
  notHasClass,
  selectable: fillable,
  text,
  textList,
  value,
  visitable
};
