import { run } from '@ember/runloop';
import $ from '-jquery';
import { test } from 'qunit';
import expectEmberError from '../../expect-ember-error';
import hbs from 'htmlbars-inline-precompile';
import { supportsRfc268 } from 'ember-cli-page-object/test-support/-private/execution_context';
import require from 'require'

let moduleForIntegration,
  testForIntegration;
if (require('ember-qunit').moduleForComponent) {
  moduleForIntegration = require('ember-qunit').moduleForComponent;
  testForIntegration = test;
} else {
  moduleForIntegration = testForIntegration =
    (() => {
      // I'm no-op in the latest versions of enber-qunit
    });
}

export { moduleForIntegration, testForIntegration };

export function IntegrationAdapter(context) {
  this.context = context;
}

IntegrationAdapter.prototype = {
  name: 'integration',

  $(selector, isAlternative) {
    return $(selector, isAlternative ? '#alternate-ember-testing' : '#ember-testing');
  },

  createTemplate(test, page, template, options) {
    template = template || '';

    if (!(test && page)) {
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    if (options && options.useAlternateContainer) {
      // The idea is to render the HTML outside the testing container so we
      // render an empty component
      $('#alternate-ember-testing').html(template);
      test.set('raw', '');
    } else {
      test.set('raw', template);
    }

    if (!supportsRfc268()) {
      page.setContext(test);
    }

    this.context.render(hbs`{{html-render html=this.raw}}`);
  },

  throws(assert, block, expected, message) {
    run(() => {
      expectEmberError(assert, block, expected, message);
    });
  },

  await() {}
};
