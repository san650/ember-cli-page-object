import { collection } from './page-object/collection';
import component from './page-object/properties/component';
import fillable from './page-object/properties/fillable';
import visitable from './page-object/properties/visitable';

export { create } from './page-object/create';
export { text } from './page-object/properties/text';
export { attribute } from './page-object/properties/attribute';
export { contains } from './page-object/properties/contains';
export { isVisible } from './page-object/properties/is-visible';
export { isHidden } from './page-object/properties/is-hidden';
export { hasClass } from './page-object/properties/has-class';
export { notHasClass } from './page-object/properties/not-has-class';
export { count } from './page-object/properties/count';
export { value } from './page-object/properties/value';
export { clickOnText } from './page-object/properties/click-on-text';
export { clickable } from './page-object/properties/clickable';

export default {
  attribute,
  collection,
  component,
  contains,
  count,
  create,
  fillable,
  hasClass,
  isHidden,
  isVisible,
  notHasClass,
  selectable: fillable,
  text,
  value,
  visitable
};
