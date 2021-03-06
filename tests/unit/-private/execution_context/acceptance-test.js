import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { testForAcceptance as test } from 'dummy/tests/helpers/properties/acceptance-adapter';
import { create, visitable } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';
import hbs from 'htmlbars-inline-precompile';
import Router from 'dummy/router';

const node = create(
  Object.assign({}, ClickTrackerDef, {
    visit: visitable('/actions-acceptance')
  })
);

moduleForAcceptance('Acceptance | acceptance context | actions', {
  beforeEach(assert) {
    Router.map(function() {
      this.route('actions-acceptance')
    });

    this.application.register(
      'component:test-component',
      createClickTrackerComponent(assert)
    );

    this.application.register(
      'template:actions-acceptance',
      hbs`{{outlet}}

      {{component "test-component"}}`
    );

    return node.visit();
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

  return window.andThen(() => {
    assert.verifySteps([
      'begin #0',
      'complete #0',
      'begin #1',
      'complete #1'
    ])
  });
});

test('sync chained invocations', async function(assert) {
  node.click()
    .click();

  return window.andThen(() => {
    assert.verifySteps([
      'begin #0',
      'complete #0',
      'begin #1',
      'complete #1',
    ])
  })
});

test('async chained invocations', async function(assert) {
  await node.click()
    .click();

  return window.andThen(() => {
    assert.verifySteps([
      'begin #0',
      'complete #0',
      'begin #1',
      'complete #1'
    ])
  })
});

