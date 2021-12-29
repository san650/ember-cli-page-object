import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import hbs from 'htmlbars-inline-precompile';
import deprecate from 'ember-cli-page-object/test-support/-private/deprecate';

import { create, text, clickOnText } from 'ember-cli-page-object';

import require from 'require';
if (require.has('@ember/test-helpers')) {
  const { render } = require('@ember/test-helpers');

  module('Deprecation | comma separated selectors', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      deprecate.__calls = [];
    });

    hooks.afterEach(function () {
      delete deprecate.__calls;
    });

    test('usage of comma-separated selector in the scope leads to a deprecation', async function (assert) {
      let page = create({
        scope: '.A, .B',
      });

      await render(hbs`<div class="B"></div>`);

      page.isVisible;

      assert.deepEqual(deprecate.__calls, [
        [
          'comma-separated-selectors',
          'Usage of comma separated selectors is deprecated in ember-cli-page-object',
          '1.16.0',
          '2.0.0',
        ],
      ]);
    });

    test('usage of comma-separated selector in the property leads to a deprecation', async function (assert) {
      let page = create({
        text: text('.A, .B'),
      });

      await render(hbs`<div class="A"></div>`);

      page.text;

      assert.deepEqual(
        deprecate.__calls.map(([name]) => name),
        ['comma-separated-selectors']
      );
    });

    test("usage of comma-separated selector in the property's custom scope leads to a deprecation", async function (assert) {
      let page = create({
        text: text('.root', {
          scope: '.A, .B',
        }),
      });

      await render(hbs`<div class="root">
        <div class="A"></div>
      </div>`);

      page.text;

      assert.deepEqual(
        deprecate.__calls.map(([name]) => name),
        ['comma-separated-selectors']
      );
    });

    test("don't show deprecation when selector doesn't use comma-separated selectors", async function (assert) {
      let page = create({
        scope: '.root',
        propText: text('.A', {
          scope: '.B',
        }),
      });

      await render(hbs`<div class="root">
        <div class="B">
          <div class="A"></div>
        </div>
      </div>`);

      page.text;

      assert.deepEqual(deprecate.__calls, []);
    });

    test("don't show deprecation when the selector contains text with comma", async function (assert) {
      let page = create({
        clickOnButton: clickOnText('button'),
      });

      await render(hbs`<fieldset>
        <button>Lorem, Ipsum</button>
      </fieldset>`);

      page.clickOnButton('Lorem, Ipsum');

      assert.deepEqual(deprecate.__calls, []);
    });
  });
}
