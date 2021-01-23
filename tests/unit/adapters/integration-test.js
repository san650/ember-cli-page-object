import Ember from 'ember';
import {
  moduleForIntegration as moduleForComponent,
  testForIntegration as test
} from 'dummy/tests/helpers/properties/integration-adapter';
import { create } from 'ember-cli-page-object'
import hbs from 'htmlbars-inline-precompile';
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';
import { setAdapter } from 'ember-cli-page-object/test-support/adapters';
import ModuleForComponentAdapter from 'ember-cli-page-object/test-support/adapters/integration';

import require from 'require';
const { wait } = require.has('ember-test-helpers') && require('ember-test-helpers');

if (wait && Ember.hasOwnProperty('$')) {
  const node = create(ClickTrackerDef);

  moduleForComponent('', 'Integration | integration adapter | actions', {
    integration: true,

    beforeEach(assert) {
      this.register('component:action-tracker', createClickTrackerComponent(assert))

      setAdapter(new ModuleForComponentAdapter());

      this.render(hbs`{{action-tracker}}`);
    },

    afterEach() {
      setAdapter(null);
    }
  });

  test('sync invocations', async function(assert) {
    node.click()
    node.click();

    await node;

    assert.verifySteps([
      'begin #0',
      'begin #1',
      'complete #0',
      'complete #1'
    ]);
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
    ]);
  });

  test('sync chained invocations', async function(assert) {
    node.click().click();

    await node;

    assert.verifySteps([
      'begin #0',
      'complete #0',
      'begin #1',
      'complete #1'
    ]);
  });
}
