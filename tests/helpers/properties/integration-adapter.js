import { run } from '@ember/runloop';
import $ from 'jquery';
export { moduleForComponent as moduleForIntegration, test as testForIntegration } from 'ember-qunit';
import expectEmberError from '../../expect-ember-error';
import hbs from 'htmlbars-inline-precompile';

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
      // eslint-disable-next-line no-console
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

    page.setContext(test);

    this.context.render(hbs`{{html-render html=raw}}`);
  },

  throws(assert, block, expected, message) {
    run(() => {
      expectEmberError(assert, block, expected, message);
    });
  },

  await() {}
};
