/* global find, findWithAssert */

import Attribute from './attribute';

function hasClass() {
  let element = findWithAssert(this.qualifiedSelector());

  return element.hasClass(this.cssClass);
}

function notHasClass() {
  let element = findWithAssert(this.qualifiedSelector());

  return !element.hasClass(this.cssClass);
}

function isVisible() {
  let element = findWithAssert(this.qualifiedSelector());

  return element.is(':visible');
}

function isHidden() {
  let element = find(this.qualifiedSelector());

  return (element.length > 0) ? element.is(':hidden') : true;
}

export function notHasClassAttribute(cssClass, selector, options = {}) {
  return new Attribute(notHasClass, selector, options, { cssClass });
}

export function hasClassAttribute(cssClass, selector, options = {}) {
  return new Attribute(hasClass, selector, options, { cssClass });
}

export function isVisibleAttribute(selector, options = {}) {
  return new Attribute(isVisible, selector, options);
}

export function isHiddenAttribute(selector, options = {}) {
  return new Attribute(isHidden, selector, options);
}
