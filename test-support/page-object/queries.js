import { trim } from './helpers';
import Attribute from './attribute';

function count() {
  return this.element().length;
}

function text() {
  return trim(this.elementOrRaise().text())
}

function value() {
  return this.elementOrRaise().val();
}

export function countAttribute(selector, options = {}) {
  return new Attribute(count, selector, options);
}

export function textAttribute(selector, options = {}) {
  return new Attribute(text, selector, options);
}

export function valueAttribute(selector, options = {}) {
  return new Attribute(value, selector, options);
}
