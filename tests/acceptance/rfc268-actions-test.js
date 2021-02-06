import { module, test } from 'qunit';
import require from 'require';
import {
  clickable,
  clickOnText,
  collection,
  create,
  fillable,
  isVisible,
  value,
  visitable
} from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

import { setupApplicationTest } from 'dummy/tests/helpers'

if (require.has('@ember/test-helpers')) {
  const { settled, waitUntil } = require('@ember/test-helpers');

  module('Acceptance | actions [rfc268]', function(hooks) {
    setupApplicationTest(hooks);

    let page = create({
      visit: visitable('/calculator'),
      keys: {
        clickOn: clickOnText('.numbers'),
        sum: clickable('button', { scope: '.operators', at: 0 }),
        equal: clickable('button', { scope: '.operators', at: 2 }),
        asyncEqual: clickable('button', { scope: '.operators', at: 3 })
      },

      screen: value('.screen input'),
      fillValue: fillable('.screen input'),
      isLoading: isVisible('.loading'),

      visitAlias: alias('visit', { chainable: true }),
      clickKeyAlias: alias('keys.clickOn', { chainable: true }),
      clickPlusAlias: alias('keys.sum', { chainable: true }),
      clickEqualAlias: alias('keys.equal', { chainable: true }),

      // Collections for accessing keys
      numbers: collection('.numbers button'),
      operators: collection('.operators button'),

      // Nested collection for accessing keys
      keyGroup: collection('.keyboard > div', {
        keys: collection('button')
      }),
    });

    test('works inside nested collections', async function(assert) {
      await page.visit();
      await page.keyGroup.objectAt(0).keys.objectAt(0).click();
      await page.keyGroup.objectAt(0).keys.objectAt(1).click();
      await page.keyGroup.objectAt(1).keys.objectAt(0).click();
      await page.keyGroup.objectAt(0).keys.objectAt(2).click();
      await page.keyGroup.objectAt(1).keys.objectAt(3).click();

      assert.equal(page.screen, '15');
    });

    test('allows to chain actions', async function(assert) {
      await page
        .visit()
        .keys
        .clickOn('1')
        .clickOn('2')
        .sum()
        .clickOn('3')
        .equal();

      assert.equal(page.screen, '15');

      await page
        .fillValue('45')
        .keys
        .clickOn('6');

      assert.equal(page.screen, '456');
    });

    test('allows to chain aliased actions', async function(assert) {
      await page
        .visitAlias()
        .clickKeyAlias('1')
        .clickKeyAlias('2')
        .clickPlusAlias()
        .clickKeyAlias('3')
        .clickEqualAlias();

      assert.equal(page.screen, '15');
    });

    test('allows to chain inside collections', async function(assert) {
      await page.visit();
      await page
        .numbers.objectAt(0)
        .click()
        .click();

      assert.equal(page.screen, '11');
    });

    test('allows to chain inside nested collections', async function(assert) {
      await page.visit();
      await page
        .keyGroup.objectAt(0)
        .keys.objectAt(0)
        .click()
        .click();

      assert.equal(page.screen, '11');
    });

    test('allows testing loading behavior using returned promise', async function(assert) {
      await page.visit();
      await page.keys.clickOn('1');
      await page.keys.clickOn('2');
      await page.keys.sum();
      await page.keys.clickOn('3');
      let promise = page.keys.asyncEqual();

      await waitUntil(() => page.isLoading);

      await promise;

      assert.notOk(page.isLoading);
      assert.equal(page.screen, '15');
    });

    test('allows testing loading behavior using settled()', async function(assert) {
      await page.visit();
      await page.keys.clickOn('1');
      await page.keys.clickOn('2');
      await page.keys.sum();
      await page.keys.clickOn('3');
      page.keys.asyncEqual();

      await waitUntil(() => page.isLoading);

      await settled();

      assert.notOk(page.isLoading);
      assert.equal(page.screen, '15');
    });

    test('action chains act like a promise', async function(assert) {
      assert.expect(1);

      await page
        .visit()
        .keys
        .clickOn('1')
        .clickOn('2')
        .then(function() {
          assert.equal(page.screen, '12');
        });
    });
  });
}
