import Attribute from './attribute';

function isHidden() {
  let element = this.element();

  return (element.length > 0) ? element.is(':hidden') : true;
}

export function isHiddenAttribute(selector, options = {}) {
  return new Attribute(isHidden, selector, options);
}
