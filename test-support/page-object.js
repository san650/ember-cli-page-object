import { deprecate } from '@ember/application/deprecations';

import {
  alias,
  attribute,
  blurrable,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
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
  fillable,
  fillable as selectable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
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
  blurrable,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
  notHasClass,
  property,
  selectable: fillable,
  text,
  triggerable,
  value,
  visitable
};

export { buildSelector, findElementWithAssert, getContext, fullScope } from 'ember-cli-page-object';

deprecate(`Importing from "test-support" is now deprecated. Please import directly from the "ember-cli-page-object" module instead.`, false, {
  id: 'ember-cli-page-object.import-from-test-support',
  until: '2.0.0',
  url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#import-from-test-support',
})
