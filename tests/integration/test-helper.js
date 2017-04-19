import Ember from 'ember';

export function createCalculatorTemplate() {
  return Ember.HTMLBars.compile('{{calculating-device}}');
}

export function createInputsTemplate() {
  return Ember.HTMLBars.compile('{{input-elements}}');
}
