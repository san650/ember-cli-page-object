import { test } from 'ember-qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { create, visitable } from 'ember-cli-page-object'
import { createClickTrackerComponent, ClickTrackerDef } from './helpers';
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

const node = create(
  Object.assign({}, ClickTrackerDef, {
    visit: visitable('/')
  })
);

moduleForAcceptance('Acceptance | acceptance context | actions');

test('async invocations', async function(assert) {
  this.application.register(
    'component:test-component',
    createClickTrackerComponent(assert)
  );

  await node.visit();

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
  this.application.register(
    'component:test-component',
    createClickTrackerComponent(assert)
  );

  await node.visit();
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
  this.application.register(
    'component:test-component',
    createClickTrackerComponent(assert)
  );

  await node.visit();
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
  this.application.register(
    'component:test-component',
    createClickTrackerComponent(assert)
  );

  await node.visit();
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

test('sync errors', async function(assert) {
  this.application.register(
    'component:test-component',

    Component.extend({
      layout: hbs`<div />`,
    })
  );

  const node = create({
    visit: visitable('/'),
    nonBlurrable: {
      resetScope: true,
      scope: 'div'
    }
  });

  await node.visit();

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
