import { text } from './properties/text';
import { isVisible } from './properties/is-visible';
import { isHidden } from './properties/is-hidden';
import { contains } from './properties/contains';
import { clickOnText } from './properties/click-on-text';
import { clickable } from './properties/clickable';
import { fillable } from './properties/fillable';
import { value } from './properties/value';

const thenDescriptor = {
  isDescriptor: true,
  value() {
    /* global wait */
    return wait().then(...arguments);
  }
};

const as = function(cb) {
  cb(this);
  return this;
};

const dsl = {
  contains: contains(),
  isHidden: isHidden(),
  isVisible: isVisible(),
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
