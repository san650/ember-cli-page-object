import { text } from './properties/text';
import { isVisible } from './properties/is-visible';
import { isHidden } from './properties/is-hidden';
import { isPresent } from './properties/is-present';
import { contains } from './properties/contains';
import { clickOnText } from './properties/click-on-text';
import { clickable } from './properties/clickable';
import { fillable } from './properties/fillable';
import { value } from './properties/value';
import { as } from './properties/as';
import wait from 'ember-test-helpers/wait';

const thenDescriptor = {
  isDescriptor: true,
  value() {
    return (window.wait || wait)().then(...arguments);
  }
};

const dsl = {
  contains: contains(),
  isHidden: isHidden(),
  isVisible: isVisible(),
  isPresent: isPresent(),
  text: text(),
  value: value(),
  clickOn: clickOnText(),
  click: clickable(),
  fillIn: fillable(),
  select: fillable(),
  then: thenDescriptor,
  as
};

export default dsl;
