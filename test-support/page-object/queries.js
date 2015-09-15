import Attribute from './attribute';

function value() {
  return this.elementOrRaise().val();
}

export function valueAttribute(selector, options = {}) {
  return new Attribute(value, selector, options);
}
