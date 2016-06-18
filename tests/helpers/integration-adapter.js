import Ember from 'ember';
import { fixture } from './acceptance-adapter';

export function IntegrationAdapter() {
  this.originalClick = window.jQuery.fn.click;
}

IntegrationAdapter.prototype = {
  click(fn) {
    window.jQuery.fn.click = function() {
      let selector, context;

      // If the context is window and the selector is prefixed with our
      // alternate container, split it
      if (/#alternate-ember-testing/.test(this.selector) && this.context === document) {
        context = '#alternate-ember-testing';
        selector = this.selector.replace(/#alternate-ember-testing\s?/, '');
      } else {
        selector = this.selector;
      }

      fn(selector, context);
    };
  },

  revert() {
    window.jQuery.fn.click = this.originalClick;
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

    let compiledTemplate = Ember.HTMLBars.compile('{{html-render raw}}');

    page.setContext(test);
    page.render(compiledTemplate);
  },

  throws(assert, block, expected, message) {
    assert.throws(block, expected, message);
  }
};
