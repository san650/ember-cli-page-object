import { create } from 'ember-cli-page-object/create';

import { collection } from 'ember-cli-page-object/collection';

import { clickable } from 'ember-cli-page-object/actions/clickable';
import { clickOnText } from 'ember-cli-page-object/actions/click-on-text';
import { fillable, fillable as selectable } from 'ember-cli-page-object/actions/fillable';
import { keyable } from 'ember-cli-page-object/actions/keyable';
import { triggerable } from 'ember-cli-page-object/actions/triggerable';
import { visitable } from 'ember-cli-page-object/actions/visitable';

import { contains } from 'ember-cli-page-object/predicates/contains';
import { hasClass } from 'ember-cli-page-object/predicates/has-class';
import { isHidden } from 'ember-cli-page-object/predicates/is-hidden';
import { isVisible } from 'ember-cli-page-object/predicates/is-visible';
import { notHasClass } from 'ember-cli-page-object/predicates/not-has-class';

import { attribute } from 'ember-cli-page-object/queries/attribute';
import { count } from 'ember-cli-page-object/queries/count';
import { is } from 'ember-cli-page-object/queries/is';
import { text } from 'ember-cli-page-object/queries/text';
import { value } from 'ember-cli-page-object/queries/value';

export { create } from 'ember-cli-page-object/create';

export { collection } from 'ember-cli-page-object/collection';

export { clickable } from 'ember-cli-page-object/actions/clickable';
export { clickOnText } from 'ember-cli-page-object/actions/click-on-text';
export { fillable, fillable as selectable } from 'ember-cli-page-object/actions/fillable';
export { keyable } from 'ember-cli-page-object/actions/keyable';
export { triggerable } from 'ember-cli-page-object/actions/triggerable';
export { visitable } from 'ember-cli-page-object/actions/visitable';

export { contains } from 'ember-cli-page-object/predicates/contains';
export { hasClass } from 'ember-cli-page-object/predicates/has-class';
export { isHidden } from 'ember-cli-page-object/predicates/is-hidden';
export { isVisible } from 'ember-cli-page-object/predicates/is-visible';
export { notHasClass } from 'ember-cli-page-object/predicates/not-has-class';

export { attribute } from 'ember-cli-page-object/queries/attribute';
export { count } from 'ember-cli-page-object/queries/count';
export { is } from 'ember-cli-page-object/queries/is';
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
  is,
  isHidden,
  isVisible,
  keyable,
  notHasClass,
  selectable,
  text,
  triggerable,
  value,
  visitable
};
