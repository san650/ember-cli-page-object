import require from 'require';
import { test, module } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';
import { TestContext } from 'ember-test-helpers';

const node = create(ClickTrackerDef);

if (require.has('@ember/test-helpers')) {
  const { render, settled } = require('@ember/test-helpers');

  module('Integration | rfc268 context | actions', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext, assert) {
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

    // in ember-cli-qunit there is some strange behavior, that requires
    // 4 `settled()` to be awaited for to satisfy the RFC268 test.
    // Considering, that RFC268 is more supposed to work against `ember-qunit`,
    // and also the fact that we are going to get rid of some legacy stuff in the future,
    // let's ignore this test case for `ember-cli-qunit` for now.
    //
    // @todo: remove the check after drop official support for ember@2
    if (!require.has('ember-cli-qunit')) {
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
    }
  });
}
