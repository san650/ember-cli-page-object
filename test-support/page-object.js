import { create } from './page-object/create';

import { collection } from './page-object/collection';

import { clickable } from './page-object/actions/clickable';
import { clickOnText } from './page-object/actions/click-on-text';
import { fillable, fillable as selectable } from './page-object/actions/fillable';
import { visitable } from './page-object/actions/visitable';

import { contains } from './page-object/predicates/contains';
import { hasClass } from './page-object/predicates/has-class';
import { isHidden } from './page-object/predicates/is-hidden';
import { isVisible } from './page-object/predicates/is-visible';
import { notHasClass } from './page-object/predicates/not-has-class';

import { attribute } from './page-object/queries/attribute';
import { count } from './page-object/queries/count';
import { text } from './page-object/queries/text';
import { value } from './page-object/queries/value';

export { create } from './page-object/create';

export { collection } from './page-object/collection';

export { clickable } from './page-object/actions/clickable';
export { clickOnText } from './page-object/actions/click-on-text';
export { fillable, fillable as selectable } from './page-object/actions/fillable';
export { visitable } from './page-object/actions/visitable';

export { contains } from './page-object/predicates/contains';
export { hasClass } from './page-object/predicates/has-class';
export { isHidden } from './page-object/predicates/is-hidden';
export { isVisible } from './page-object/predicates/is-visible';
export { notHasClass } from './page-object/predicates/not-has-class';

export { attribute } from './page-object/queries/attribute';
export { count } from './page-object/queries/count';
export { text } from './page-object/queries/text';
export { value } from './page-object/queries/value';

export { buildSelector, findElementWithAssert, findElement } from './page-object/helpers';

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
  value,
  visitable
};
