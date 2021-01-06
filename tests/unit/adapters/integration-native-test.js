import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import { create } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';
import { setAdapter } from 'ember-cli-page-object/test-support/adapters';
import ModuleForComponentNativeDOMAdapter from 'ember-cli-page-object/test-support/adapters/integration-native-events';

const node = create(ClickTrackerDef);

if (Ember.hasOwnProperty('$')) {
  moduleForComponent('', 'Integration | integration adapter | actions [native-events]', {
    integration: true,

    beforeEach(assert) {
      this.register('component:action-tracker', createClickTrackerComponent(assert))

      setAdapter(new ModuleForComponentNativeDOMAdapter());

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
    await node.click()
      .click();

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
      'complete #1',
    ])
  });
}
