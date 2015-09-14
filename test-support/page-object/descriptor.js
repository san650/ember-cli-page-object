import Ember from 'ember';
import Property from './property';

/**
 * Represents a definition of a property
 */
export default class Descriptor {
  constructor(action, options) {
    this.action = action;
    this.options = options;
  }

  propertyFor(target, key) {
    return new Property(target, key, this.options, this.action);
  }

  buildPageObjectAttribute(target, key) {
    Ember.deprecate('Use `Descriptor.propertyFor` to build the property.');

    let property = this.propertyFor(target, key);

    return function() {
      return property.invoke();
    };
  }
}
