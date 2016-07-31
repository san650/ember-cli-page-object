import Ember from 'ember';
import startApp from '../start-app';
import { module as qunitModule } from 'qunit';

export { test as testForAcceptance } from 'qunit';

let noop = function() {};

export function AcceptanceAdapter() {
  this.originalClick = window.click;
  this.originalFillIn = window.fillIn;
  this.originalTriggerEvent = window.triggerEvent;
}

AcceptanceAdapter.prototype = {
  click(fn) {
    window.click = fn;
  },

  fillIn(fn) {
    window.fillIn = function(selector, contextOrText, text) {
      if (text) {
        fn(selector, contextOrText, text);
      } else {
        fn(selector, undefined, contextOrText);
      }
    };
  },

  triggerEvent(fn /*selector, container, eventName, eventOptions*/) {
    window.triggerEvent = fn;
  },

  revert() {
    window.click = this.originalClick;
    window.fillIn = this.originalFillIn;
    window.triggerEvent = this.originalTriggerEvent;
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
  },

  andThen(fn) {
    andThen(fn);
  }
};

export function fixture(str, options = {}) {
  if (options.useAlternateContainer) {
    $('#alternate-ember-testing').html(str);
  } else {
    $('#ember-testing').html(`<section>${str}</section>`);
  }
}

export function moduleForAcceptance(name, options = {}) {
  let beforeEach = options.beforeEach || noop;
  let afterEach  = options.afterEach || noop;

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
