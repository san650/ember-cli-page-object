import { attribute } from './page-object/properties/attribute';
import { clickOnText } from './page-object/properties/click-on-text';
import { clickable } from './page-object/properties/clickable';
import { collection } from './page-object/properties/collection';
import { contains } from './page-object/properties/contains';
import { count } from './page-object/properties/count';
import { create } from './page-object/create';
import { fillable } from './page-object/properties/fillable';
import { hasClass } from './page-object/properties/has-class';
import { isHidden } from './page-object/properties/is-hidden';
import { isVisible } from './page-object/properties/is-visible';
import { notHasClass } from './page-object/properties/not-has-class';
import { text } from './page-object/properties/text';
import { value } from './page-object/properties/value';
//import visitable from './page-object/properties/visitable';

export { attribute } from './page-object/properties/attribute';
export { clickOnText } from './page-object/properties/click-on-text';
export { clickable } from './page-object/properties/clickable';
export { collection } from './page-object/properties/collection';
export { contains } from './page-object/properties/contains';
export { count } from './page-object/properties/count';
export { create } from './page-object/create';
export { fillable, fillable as selectable } from './page-object/properties/fillable';
export { hasClass } from './page-object/properties/has-class';
export { isHidden } from './page-object/properties/is-hidden';
export { isVisible } from './page-object/properties/is-visible';
export { notHasClass } from './page-object/properties/not-has-class';
export { text } from './page-object/properties/text';
export { value } from './page-object/properties/value';

export default {
  attribute,
  clickOnText,
  clickable,
  collection,
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
  value//,
  //visitable
};
