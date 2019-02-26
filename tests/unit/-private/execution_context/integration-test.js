import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import { create } from 'ember-cli-page-object'
import hbs from 'htmlbars-inline-precompile';
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';

if (Ember.hasOwnProperty('$')) {
  const node = create(ClickTrackerDef);

  moduleForComponent('', 'Integration | integration context | actions', {
    integration: true,

    beforeEach(assert) {
      this.register('component:action-tracker', createClickTrackerComponent(assert))

      node.setContext(this);

      this.render(hbs`{{action-tracker}}`);
    },

    afterEach() {
      node.removeContext();
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

    return wait().then(() => {
      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1'
      ])
    });
  });

  test('sync chained invocations', async function(assert) {
    node.click()
      .click();

    return wait().then(() => {
      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1',
      ])
    })
  });

  test('async chained invocations', async function(assert) {
    await node.click()
      .click();

    return wait().then(() => {
      assert.verifySteps([
        'begin #0',
        'begin #1',
        'complete #0',
        'complete #1'
      ])
    })
  });
}
