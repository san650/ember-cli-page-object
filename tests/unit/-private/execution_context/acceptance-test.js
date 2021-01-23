import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { create, visitable } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';

const node = create(
  Object.assign({}, ClickTrackerDef, {
    visit: visitable('/')
  })
);

moduleForAcceptance('Acceptance | acceptance context | actions', {
  beforeEach(assert) {
    this.application.register(
      'component:test-component',
      createClickTrackerComponent(assert)
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

