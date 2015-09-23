import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

let application;

export function moduleFor(category, helperName) {
  module(`${category} | .${helperName}`, {
    beforeEach: function() {
      application = startApp();
    },
    afterEach: function() {
      Ember.run(application, 'destroy');

      // Cleanup DOM
      $('#ember-testing').html('');
    }
  });
}

export function buildAttribute(attribute, ...params) {
  return attribute(...params).propertyFor({}, 'key').toFunction();
}

export function buildAttributeWithOptions(attribute, page, ...params) {
  return attribute(...params).propertyFor(page, 'key').toFunction();
}

export function it(description, fn) {
  test(`it ${description}`, fn);
}

export function fixture(str) {
  $('#ember-testing').html(str);
}

export function buildProperty(descriptor, parent = {}) {
  return descriptor.propertyFor(parent, 'key');
}
