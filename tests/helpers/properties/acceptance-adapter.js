import startApp from '../start-app';
import { module as qunitModule } from 'qunit';

export { test as testForAcceptance } from 'qunit';

import Ember from 'ember';
const { $, run } = Ember;

let noop = function() {};

export function AcceptanceAdapter(testContext) {
  this.testContext = testContext;
}

AcceptanceAdapter.prototype = {
  name: 'acceptance',

  $(selector, isAlternative) {
    return Ember.$(selector, isAlternative ? '#alternate-ember-testing' : '#ember-testing');
  },

  async createTemplate(test, page, template, { useAlternateContainer } = {}) {
    template = template || '';

    if (!(test && page)) {
      // eslint-disable-next-line no-console
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    if (useAlternateContainer) {
      $('#alternate-ember-testing').html(template);
    } else {
      await window.visit('/html-render');
      run(() => this.testContext.application.__container__.lookup('controller:html-render').set('html', template));
    }
  },

  currentURL() {
    return window.currentURL();
  },

  throws(assert, block, expected, message) {
    let done = assert.async();

    block().then().catch((error) => {
      assert.ok(expected.test(error.toString()), message);
    }).finally(done);
  },

  async await() {
    await window.wait();
  }
};

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
      $('#alternate-ember-testing').html('');
    }
  });
}
