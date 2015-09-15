import Attribute from './attribute';

function notHasClass() {
  return !this.elementOrRaise().hasClass(this.cssClass);
}

function isVisible() {
  return this.elementOrRaise().is(':visible');
}

function isHidden() {
  let element = this.element();

  return (element.length > 0) ? element.is(':hidden') : true;
}

export function notHasClassAttribute(cssClass, selector, options = {}) {
  return new Attribute(notHasClass, selector, options, { cssClass });
}

export function isVisibleAttribute(selector, options = {}) {
  return new Attribute(isVisible, selector, options);
}

export function isHiddenAttribute(selector, options = {}) {
  return new Attribute(isHidden, selector, options);
}
