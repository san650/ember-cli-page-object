import Ember from 'ember';
import { module } from 'qunit';
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

export function fixture(str) {
  $('#ember-testing').html(str);

  return $('#ember-testing').children(':first');
}

export function buildProperty(descriptor, parent = {}) {
  return descriptor.propertyFor(parent, 'key');
}
