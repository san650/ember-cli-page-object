import Ember from 'ember';
import Property from './property';

let copy = Ember.copy,
    isFunction = Ember.$.isFunction;

/**
 * Represents a definition of a property
 */
export default class Descriptor {
  constructor(action, options, preProcess = null) {
    this.action = action;
    this.options = options;
    this.preProcess = preProcess;
  }

  propertyFor(target, key) {
    let optionsCopy = copy(this.options);

    if (isFunction(this.preProcess)) {
      this.preProcess(target, key, optionsCopy);
    }

    return new Property(target, key, optionsCopy, this.action);
  }
}
