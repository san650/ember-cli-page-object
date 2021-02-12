import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import require from 'require';
import {
  create,
  clickOnText,
  clickable,
  collection,
  fillable,
  isVisible,
  value,
  visitable
} from '../page-object';
import { alias } from 'ember-cli-page-object/macros';

if (require.has('@ember/test-helpers')) {
  const { settled, waitUntil } = require('@ember/test-helpers');

  module('Acceptance | actions [rfc268]', function(hooks) {
    setupApplicationTest(hooks);

    let page;
    hooks.beforeEach(function() {
      // postpone legacy collection creation in order to
      // avoid deprecation message on tests startup
      page = create({
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

        // Legacy collections for accessing keys
        legacyNumbers: collection({
          itemScope: '.numbers button'
        }),
        legacyOperators: collection({
          itemScope: '.operators button'
        }),

        // Nested collection for accessing keys
        keyGroup: collection('.keyboard > div', {
          keys: collection('button')
        }),

        // Nested legacy collections for accessing keys
        legacyKeyGroup: collection({
          itemScope: '.keyboard > div',

          item: {
            keys: collection({
              itemScope: 'button'
            })
          }
        })
      });
    })

    test('works inside collections', async function(assert) {
      await page.visit();
      await page.numbers.objectAt(0).click();
      await page.numbers.objectAt(1).click();
      await page.operators.objectAt(0).click();
      await page.numbers.objectAt(2).click();
      await page.operators.objectAt(3).click();

      assert.equal(page.screen, '15');
    });

    test('works inside legacy collections', async function(assert) {
      await page.visit();
      await page.legacyNumbers(0).click();
      await page.legacyNumbers(1).click();
      await page.legacyOperators(0).click();
      await page.legacyNumbers(2).click();
      await page.legacyOperators(3).click();

      assert.equal(page.screen, '15');
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

    test('works inside nested legacy collections', async function(assert) {
      await page.visit();
      await page.legacyKeyGroup(0).keys(0).click();
      await page.legacyKeyGroup(0).keys(1).click();
      await page.legacyKeyGroup(1).keys(0).click();
      await page.legacyKeyGroup(0).keys(2).click();
      await page.legacyKeyGroup(1).keys(3).click();

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

    test('allows to chain inside legacy collections', async function(assert) {
      await page.visit();
      await page
        .legacyNumbers(0)
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

    test('allows to chain inside nested legacy collections', async function(assert) {
      await page.visit();
      await page
        .legacyKeyGroup(0)
        .keys(0)
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

    test('fill in by attribute', async function(assert) {
      let page = create({
        visit: visitable('/inputs'),
        fillIn: fillable()
      });

      await page.visit();

      await page.fillIn('input1', 'input 1');
      await page.fillIn('input2', 'input 2')
      await page.fillIn('input3', 'input 3');
      await page.fillIn('input4', 'input 4');
      await page.fillIn('input5', 'input 5');

      assert.dom('.input1-value').hasValue('input 1');
      assert.dom('.input2-value').hasValue('input 2');
      assert.dom('.input3-value').hasValue('input 3');
      assert.dom('.input4-value').hasValue('input 4');
      assert.dom('.input5-value').hasValue('input 5');

      await page.fillIn('textarea1', 'textarea 1');
      await page.fillIn('textarea2', 'textarea 2');
      await page.fillIn('textarea3', 'textarea 3');
      await page.fillIn('textarea4', 'textarea 4');
      await page.fillIn('textarea5', 'textarea 5');

      assert.dom('.textarea1-value').hasValue('textarea 1');
      assert.dom('.textarea2-value').hasValue('textarea 2');
      assert.dom('.textarea3-value').hasValue('textarea 3');
      assert.dom('.textarea4-value').hasValue('textarea 4');
      assert.dom('.textarea5-value').hasValue('textarea 5');

      await page.fillIn('contenteditable1', 'contenteditable 1');
      await page.fillIn('contenteditable2', 'contenteditable 2');
      await page.fillIn('contenteditable3', 'contenteditable 3');
      await page.fillIn('contenteditable4', 'contenteditable 4');
      await page.fillIn('contenteditable5', 'contenteditable 5');

      assert.dom('.contenteditable1-content').hasText('contenteditable 1');
      assert.dom('.contenteditable2-content').hasText('contenteditable 2');
      assert.dom('.contenteditable3-content').hasText('contenteditable 3');
      assert.dom('.contenteditable4-content').hasText('contenteditable 4');
      assert.dom('.contenteditable5-content').hasText('contenteditable 5');

      await page.fillIn('select1', 'select 1 option 2');
      await page.fillIn('select2', 'select 2 option 2');
      await page.fillIn('select3', 'select 3 option 2');
      await page.fillIn('select4', 'select 4 option 2');
      await page.fillIn('select5', 'select 5 option 2');

      assert.dom('.select1-value').hasValue('select 1 option 2');
      assert.dom('.select2-value').hasValue('select 2 option 2');
      assert.dom('.select3-value').hasValue('select 3 option 2');
      assert.dom('.select4-value').hasValue('select 4 option 2');
      assert.dom('.select5-value').hasValue('select 5 option 2');
    });
  });
}
