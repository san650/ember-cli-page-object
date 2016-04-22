import { create } from 'ember-cli-page-object/create';

import { collection } from 'ember-cli-page-object/collection';

import { clickable } from 'ember-cli-page-object/actions/clickable';
import { clickOnText } from 'ember-cli-page-object/actions/click-on-text';
import { fillable, fillable as selectable } from 'ember-cli-page-object/actions/fillable';
import { visitable } from 'ember-cli-page-object/actions/visitable';

import { contains } from 'ember-cli-page-object/predicates/contains';
import { hasClass } from 'ember-cli-page-object/predicates/has-class';
import { isHidden } from 'ember-cli-page-object/predicates/is-hidden';
import { isVisible } from 'ember-cli-page-object/predicates/is-visible';
import { notHasClass } from 'ember-cli-page-object/predicates/not-has-class';

import { attribute } from 'ember-cli-page-object/queries/attribute';
import { count } from 'ember-cli-page-object/queries/count';
import { text } from 'ember-cli-page-object/queries/text';
import { value } from 'ember-cli-page-object/queries/value';

export { create } from 'ember-cli-page-object/create';

export { collection } from 'ember-cli-page-object/collection';

export { clickable } from 'ember-cli-page-object/actions/clickable';
export { clickOnText } from 'ember-cli-page-object/actions/click-on-text';
export { fillable, fillable as selectable } from 'ember-cli-page-object/actions/fillable';
export { visitable } from 'ember-cli-page-object/actions/visitable';

export { contains } from 'ember-cli-page-object/predicates/contains';
export { hasClass } from 'ember-cli-page-object/predicates/has-class';
export { isHidden } from 'ember-cli-page-object/predicates/is-hidden';
export { isVisible } from 'ember-cli-page-object/predicates/is-visible';
export { notHasClass } from 'ember-cli-page-object/predicates/not-has-class';

export { attribute } from 'ember-cli-page-object/queries/attribute';
export { count } from 'ember-cli-page-object/queries/count';
export { text } from 'ember-cli-page-object/queries/text';
export { value } from 'ember-cli-page-object/queries/value';
export { property } from 'ember-cli-page-object/queries/property';

export { buildSelector, findElementWithAssert, findElement } from 'ember-cli-page-object/helpers';

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
  selectable,
  text,
  value,
  visitable
};
