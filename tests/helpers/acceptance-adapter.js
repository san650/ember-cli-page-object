import Ember from 'ember';
import startApp from './start-app';
import { module as qunitModule } from 'qunit';

let k = function() {};

export function AcceptanceAdapter() {
  this.originalClick = window.click;
}

AcceptanceAdapter.prototype = {
  click(fn) {
    window.click = fn;
  },

  revert() {
    window.click = this.originalClick;
  },

  createTemplate(test, page, template, options) {
    template = template || '';

    if (!(test && page)) {
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    fixture(template, options);
  },

  throws(assert, block, expected, message) {
    let done = assert.async();

    block().then().catch((error) => {
      assert.ok(expected.test(error.toString()), message);
    }).finally(done);
  }
};

export function fixture(str, options = {}) {
  if (options.useAlternateContainer) {
    $('#alternate-ember-testing').html(str);
  } else {
    $('#ember-testing').html(str);
  }
}

export function moduleForAcceptance(name, options = {}) {
  let beforeEach = options.beforeEach || k;
  let afterEach  = options.afterEach || k;

  qunitModule(name, {
    beforeEach() {
      this.application = startApp();
      beforeEach.call(this);
    },

    afterEach() {
      afterEach.call(this);

      Ember.run(this.application, 'destroy');

      // Cleanup DOM
      $('#ember-testing').html('');
      $('#alternate-ember-testing').html('');
    }
  });
}
