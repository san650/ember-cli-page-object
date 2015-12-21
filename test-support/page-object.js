import { collection } from './page-object/collection';
import attribute from './page-object/properties/attribute';
import clickOnText from './page-object/properties/click-on-text';
import clickable from './page-object/properties/clickable';
import component from './page-object/properties/component';
import count from './page-object/properties/count';
import fillable from './page-object/properties/fillable';
import hasClass from './page-object/properties/has-class';
import isHidden from './page-object/properties/is-hidden';
import isVisible from './page-object/properties/is-visible';
import notHasClass from './page-object/properties/not-has-class';
import textList from './page-object/properties/text-list';
import value from './page-object/properties/value';
import visitable from './page-object/properties/visitable';

export { create } from './page-object/create';
export { text } from './page-object/properties/text';

export default {
  attribute,
  clickOnText,
  clickable,
  collection,
  component,
  count,
  fillable,
  hasClass,
  isHidden,
  isVisible,
  notHasClass,
  selectable: fillable,
  textList,
  value,
  visitable
};
