import Ember from 'ember';
import { module } from 'qunit';
import startApp from '../helpers/start-app';

let application;

export function moduleFor(helperName) {
  module(`${helperName}`, {
    beforeEach: function() {
      application = startApp();
    },
    afterEach: function() {
      Ember.run(application, 'destroy');

      // Cleanup DOM
      $('#ember-testing').html('');
      $('#alternate-ember-testing').html('');
    }
  });
}

export function fixture(str, options = {}) {
  if (options.useAlternateContainer) {
    $('#alternate-ember-testing').html(str);
  } else {
    $('#ember-testing').html(str);
  }
}
