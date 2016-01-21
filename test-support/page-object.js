//import { collection } from './page-object/collection';
import { create } from './page-object/create';
import { text } from './page-object/properties/text';
import { attribute } from './page-object/properties/attribute';
import { contains } from './page-object/properties/contains';
import { isVisible } from './page-object/properties/is-visible';
import { isHidden } from './page-object/properties/is-hidden';
import { hasClass } from './page-object/properties/has-class';
import { notHasClass } from './page-object/properties/not-has-class';
import { count } from './page-object/properties/count';
import { value } from './page-object/properties/value';
import { clickOnText } from './page-object/properties/click-on-text';
import { clickable } from './page-object/properties/clickable';
import { fillable } from './page-object/properties/fillable';
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
export { fillable, fillable as selectable } from './page-object/properties/fillable';

export default {
  attribute,
  clickable,
  clickOnText,
  //collection,
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
