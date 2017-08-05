import {
  alias,
  attribute,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  extend,
  fillable,
  hasClass,
  is,
  isHidden,
  isVisible,
  exists,
  nested,
  notHasClass,
  property,
  text,
  triggerable,
  value,
  visitable
} from 'ember-cli-page-object';

export {
  alias,
  attribute,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  exists,
  extend,
  fillable,
  fillable as selectable,
  hasClass,
  is,
  isHidden,
  isVisible,
  nested,
  notHasClass,
  property,
  text,
  triggerable,
  value,
  visitable
};

export default {
  alias,
  attribute,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  exists,
  extend,
  fillable,
  hasClass,
  is,
  isHidden,
  isVisible,
  nested,
  notHasClass,
  property,
  selectable: fillable,
  text,
  triggerable,
  value,
  visitable
};

export { buildSelector, findElementWithAssert, findElement, getContext, fullScope } from 'ember-cli-page-object';
