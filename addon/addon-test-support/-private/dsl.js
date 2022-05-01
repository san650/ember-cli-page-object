import { as } from '../properties/as';
import { blurrable } from '../properties/blurrable';
import { clickable } from '../properties/clickable';
import { clickOnText } from '../properties/click-on-text';
import { contains } from '../properties/contains';
import { fillable } from '../properties/fillable';
import { focusable } from '../properties/focusable';
import { isHidden } from '../properties/is-hidden';
import { isPresent } from '../properties/is-present';
import { isVisible } from '../properties/is-visible';
import { text } from '../properties/text';
import { value } from '../properties/value';

import { getRoot } from './helpers';

const thenDescriptor = {
  isDescriptor: true,
  value() {
    const root = getRoot(this);
    const chainedRoot = root._chainedTree || root;

    return chainedRoot._promise.then(...arguments);
  },
};

const dsl = {
  as,
  blur: blurrable(),
  click: clickable(),
  clickOn: clickOnText(),
  contains: contains(),
  fillIn: fillable(),
  focus: focusable(),
  isHidden: isHidden(),
  isPresent: isPresent(),
  isVisible: isVisible(),
  select: fillable(),
  text: text(),
  then: thenDescriptor,
  value: value(),
};

export default dsl;
