/* global findWithAssert */

import { trim } from './helpers';
import Attribute from './attribute';

function attribute() {
  let element = findWithAssert(this.qualifiedSelector());

  return element.attr(this.attributeName);
}

function count() {
  let element = find(this.qualifiedSelector());

  return element.length;
}

function text() {
  let element = findWithAssert(this.qualifiedSelector());

  return trim(element.text());
}

function value() {
  let element = findWithAssert(this.qualifiedSelector());

  return trim(element.val());
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
