import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import { create } from 'ember-cli-page-object'
import { useNativeEvents } from 'ember-cli-page-object/extend'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';

const node = create(ClickTrackerDef);

if (Ember.hasOwnProperty('$')) {
  moduleForComponent('', 'Integration | integration context | actions [native-events]', {
    integration: true,

    beforeEach(assert) {
      this.register('component:action-tracker', createClickTrackerComponent(assert))

      node.setContext(this);

      this.render(hbs`{{action-tracker}}`);
    },

    afterEach() {
      node.removeContext();

      useNativeEvents(false);
    }
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

  test('sync invocations', async function(assert) {
    node.click()
    node.click();

    return settled().then(() => {
      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1'
      ])
    });
  });

  test('chained sync invocations', async function(assert) {
    node.click()
      .click();

    return settled().then(() => {
      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1',
      ])
    });
  });

  test('async chained invocations', async function(assert) {
    await node.click()
      .click();

    return settled().then(() => {
      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1'
      ])
    });
  });
}
