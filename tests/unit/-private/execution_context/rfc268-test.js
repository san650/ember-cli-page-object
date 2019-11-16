import require from 'require';
import { test, module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';

const node = create(ClickTrackerDef);

if (require.has('@ember/test-helpers')) {
  const { render, settled } = require('@ember/test-helpers');

  module('Integration | rfc268 context | actions', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(assert) {
      this.owner.register('component:action-tracker', createClickTrackerComponent(assert))

      return render(hbs`{{action-tracker}}`);
    })

    test('sync invocations', async function(assert) {
      node.click()
      await node.click();

      await settled();

      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1'
      ])
    });

    test('async invocations', async function(assert) {
      await node.click()
      await node.click();

      assert.verifySteps([
        'begin #0',
        'complete #0',
        'begin #1',
        'complete #1'
      ])
    });

    test('async chained invocations', async function(assert) {
      await node.click().click();

      assert.verifySteps([
        'begin #0',
        'complete #0',
        'begin #1',
        'complete #1'
      ])
    });

    test('sync chained invocations', async function(assert) {
      node.click().click();

      await settled();
      await settled();
      await settled();

      assert.verifySteps([
        'begin #0',
        'complete #0',
        'begin #1',
        'complete #1',
      ])
    });

    test('sync errors', async function(assert) {
      await render(hbs`<div data-test />`);

      const node = create({
        nonBlurrable: {
          resetScope: true,
          scope: '[data-test]'
        }
      });

      const done = assert.async();
      assert.rejects(node.nonBlurrable.blur(), /page\.nonBlurrable.blur()/, 'Element is not focusable because it is not a link');

      node.click();

      return new Promise((resolve) => {
        setTimeout(() => {
          done();
          resolve();
        }, 500);
      })
    });
  });
}
