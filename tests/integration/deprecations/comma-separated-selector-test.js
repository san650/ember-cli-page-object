import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { create, text } from 'dummy/tests/page-object';

import require from 'require';
if (require.has('@ember/test-helpers')) {
  const { render } = require('@ember/test-helpers');

  module('Deprecation | comma separated selectors', function(hooks) {
    setupRenderingTest(hooks);

    test('usage of comma-separated selector in the scope leads to a deprecation', async function(assert) {
      let page = create({
        scope: '.A, .B'
      });

      await render(hbs`<div class="B"></div>`);

      page.isVisible;

      assert.expectDeprecation('Usage of comma separated selectors is deprecated in ember-cli-page-object');
    });

    test('usage of comma-separated selector in the property leads to a deprecation', async function(assert) {
      let page = create({
        text: text('.A, .B')
      });

      await render(hbs`<div class="A"></div>`);

      page.text;

      assert.expectDeprecation('Usage of comma separated selectors is deprecated in ember-cli-page-object');
    });

    test('usage of comma-separated selector in the property\'s custom scope leads to a deprecation', async function(assert) {
      let page = create({
        text: text('.root', {
          scope: '.A, .B'
        })
      });

      await render(hbs`<div class="root">
        <div class="A"></div>
      </div>`);

      page.text;

      assert.expectDeprecation('Usage of comma separated selectors is deprecated in ember-cli-page-object');
    });

    test('don\'t show deprecation when selector doesn\'t use comma-separated selectors', async function(assert) {
      let page = create({
        scope: '.root',
        propText: text('.A', {
          scope: '.B'
        })
      });

      await render(hbs`<div class="root">
        <div class="B">
          <div class="A"></div>
        </div>
      </div>`);

      page.text;

      assert.expectNoDeprecation();
    });
  });
}
