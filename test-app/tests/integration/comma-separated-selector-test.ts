import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from '../helpers';
import hbs from 'htmlbars-inline-precompile';
import { create, text, clickOnText } from 'ember-cli-page-object';

module('comma separated selectors', function (hooks) {
  setupRenderingTest(hooks);

  test('usage in `definition scope` leads to error', async function (assert) {
    const page = create({
      scope: '.A, .B',
    });

    await render(hbs`<div class="B"></div>`);

    assert.throws(
      () => page.isVisible,
      new Error(
        'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
      )
    );
  });

  test('usage in a `property scope` leads to error', async function (assert) {
    const page = create({
      text: text('.A, .B'),
    });

    await render(hbs`<div class="A"></div>`);

    assert.throws(
      () => page.text,
      new Error(
        'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
      )
    );
  });

  test('usage in `property custom scope` leads to error', async function (assert) {
    const page = create({
      text: text('.root', {
        scope: '.A, .B',
      }),
    });

    await render(hbs`<div class="root">
      <div class="A"></div>
    </div>`);

    assert.throws(
      () => page.text,
      new Error(
        'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
      )
    );
  });

  test("doesn't error when the selector contains text with comma", async function (assert) {
    const page = create({
      clickOnButton: clickOnText('button'),
    });

    await render(hbs`<fieldset>
      <button type="button">Lorem, Ipsum</button>
    </fieldset>`);

    page.clickOnButton('Lorem, Ipsum');

    assert.true(true, 'click happens without an error');
  });
});
