import Attribute from './attribute';

function isVisible() {
  return this.elementOrRaise().is(':visible');
}

function isHidden() {
  let element = this.element();

  return (element.length > 0) ? element.is(':hidden') : true;
}

export function isVisibleAttribute(selector, options = {}) {
  return new Attribute(isVisible, selector, options);
}

export function isHiddenAttribute(selector, options = {}) {
  return new Attribute(isHidden, selector, options);
}
