import { test } from 'ember-qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { create, visitable } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';

const node = create(
  Object.assign({}, ClickTrackerDef, {
    visit: visitable('/')
  })
);

moduleForAcceptance('Acceptance | acceptance adapter | actions', {
  beforeEach(assert) {
    this.application.register(
      'component:test-component',
      createClickTrackerComponent(assert)
    );

    return node.visit();
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
    'complete #1',
  ])
});
