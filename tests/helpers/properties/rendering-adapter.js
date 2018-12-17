import Rfc268Adapter from './rfc268-adapter';
import hbs from 'htmlbars-inline-precompile';
import $ from '-jquery';
import require from 'require';

function render(...args) {
  return require('@ember/test-helpers').render(...args);
}

export default function RenderingAdapter(hooks) {
  Rfc268Adapter.call(this, hooks);
}

RenderingAdapter.prototype = Object.create(Rfc268Adapter.prototype);

Object.assign(RenderingAdapter.prototype, {
  name: 'rendering',

  async createTemplate(test, page, template = '', { useAlternateContainer } = {}) {
    if (!(test && page)) {
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    if (useAlternateContainer) {
      // The idea is to render the HTML outside the testing container so we
      // render an empty component
      $('#alternate-ember-testing').html(template);
      test.set('raw', '');
    } else {
      test.set('raw', template);
    }

    await render(hbs`{{html-render html=raw}}`);
  }
});
