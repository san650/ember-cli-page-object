import { as } from './properties/as';
import { clickable } from './properties/clickable';
import { clickOnText } from './properties/click-on-text';
import { contains } from './properties/contains';
import { fillable } from './properties/fillable';
import { isHidden } from './properties/is-hidden';
import { isPresent } from './properties/is-present';
import { isVisible } from './properties/is-visible';
import { text } from './properties/text';
import { value } from './properties/value';
import wait from 'ember-test-helpers/wait';

const thenDescriptor = {
  isDescriptor: true,
  value() {
    return (window.wait || wait)().then(...arguments);
  }
};

const dsl = {
  as,
  click: clickable(),
  clickOn: clickOnText(),
  contains: contains(),
  fillIn: fillable(),
  isHidden: isHidden(),
  isPresent: isPresent(),
  isVisible: isVisible(),
  select: fillable(),
  text: text(),
  then: thenDescriptor,
  value: value()
};

export default dsl;
