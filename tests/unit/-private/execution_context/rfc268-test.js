import require from 'require';
import { test, module } from 'qunit';
import { setupRenderingTest, setupTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';

const node = create(ClickTrackerDef);

if (require.has('@ember/test-helpers')) {
  const { render, settled } = require('@ember/test-helpers');

  module('Integration | rfc268 context', function() {
    module('getExecutionContext', function(hooks) {
      setupTest(hooks);

      let origGetContext;
      let compatModule;

      hooks.beforeEach(function() {
        compatModule = require('ember-cli-page-object/test-support/-private/compatibility');
        origGetContext = compatModule.getContext;
      });

      hooks.afterEach(function() {
        compatModule.getContext = origGetContext;

        // Make sure we don't leave this module in a mutated state
        window.require.unsee('ember-cli-page-object/test-support/-private/execution_context');
      });

      test(`fails if can't be used as a fallback context`, async function(assert) {
        compatModule.getContext = () => null

        const a = create();

        assert.throws(
          () => a.isVisible,
          'Can not detect test type. Please make sure you use the latest version of "@ember/test-helpers"'
        );
      });
    });

    module('actions', function(hooks) {
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
    });
  });
}
