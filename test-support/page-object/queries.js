import { trim } from './helpers';
import Attribute from './attribute';

function text() {
  return trim(this.elementOrRaise().text())
}

function value() {
  return this.elementOrRaise().val();
}

export function textAttribute(selector, options = {}) {
  return new Attribute(text, selector, options);
}

export function valueAttribute(selector, options = {}) {
  return new Attribute(value, selector, options);
}
