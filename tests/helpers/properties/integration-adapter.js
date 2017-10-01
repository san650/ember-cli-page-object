import { fixture } from './acceptance-adapter';
export { moduleForComponent as moduleForIntegration, test as testForIntegration } from 'ember-qunit';
import { expectEmberError } from '../../test-helper';

import Ember from 'ember';

export function IntegrationAdapter(original) {
  this.original = original;
  this.originalPrototype = original.prototype;

  original.prototype = Object.create(this.originalPrototype);
  this.spy = original.prototype;
}

IntegrationAdapter.prototype = {
  name: 'integration',

  $(selector, isAlternative) {
    return Ember.$(selector, isAlternative ? '#alternate-ember-testing' : '#ember-testing');
  },

  revert() {
    this.original.prototype = Object.create(this.originalPrototype);
  },

  createTemplate(test, page, template, options) {
    template = template || '';

    if (!(test && page)) {
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    if (options && options.useAlternateContainer) {
      // The idea is to render the HTML outside the testing container so we
      // render an empty component
      fixture(template, options);
      test.set('raw', '');
    } else {
      test.set('raw', template);
    }

    let compiledTemplate = Ember.HTMLBars.compile('{{html-render html=raw}}');

    page.setContext(test);
    page.render(compiledTemplate);
  },

  throws(assert, block, expected, message) {
    Ember.run(() => {
      expectEmberError(assert, block, expected, message);
    });
  },

  find() {
    return this.original.find(...arguments);
  },

  andThen(fn) {
    fn();
  },

  wait() {}
};
