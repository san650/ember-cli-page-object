/**
 * Represents a definition of a property associated to a target object
 */
export default class Property {
  constructor(target, key, options, action) {
    this.target = target;
    this.key = key;
    this.options = options;
    this.action = action;
  }

  invoke(...params) {
    return this.action(this.target, this.key, this.options, ...params);
  }

  toFunction() {
    let property = this;

    return function(...params) {
      return property.invoke(...params);
    };
  }
}
