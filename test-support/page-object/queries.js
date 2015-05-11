import { trim } from './helpers';
import Attribute from './attribute';

function attribute() {
  return this.elementOrRaise().attr(this.attributeName);
}

function count() {
  return this.element().length;
}

function text() {
  return trim(this.elementOrRaise().text())
}

function value() {
  return this.elementOrRaise().val();
}

export function attributeAttribute(attributeName, selector, options = {}) {
  return new Attribute(attribute, selector, options, { attributeName });
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
