import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import PageObject from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

moduleForAcceptance('Acceptance | actions');

let {
  clickOnText,
  clickable,
  fillable,
  value,
  visitable
} = PageObject;

let page = PageObject.create({
  visit: visitable('/calculator'),
  keys: {
    clickOn: clickOnText('.numbers'),
    sum: clickable('button', { scope: '.operators', at: 0 }),
    equal: clickable('button', { scope: '.operators', at: 2 })
  },

  screen: value('.screen input'),
  fillValue: fillable('.screen input'),

  visitAlias: alias('visit', { chainable: true }),
  clickKeyAlias: alias('keys.clickOn', { chainable: true }),
  clickPlusAlias: alias('keys.sum', { chainable: true }),
  clickEqualAlias: alias('keys.equal', { chainable: true })
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

test('action chains act like a promise', function(assert) {
  assert.expect(1);

  page
    .visit()
    .keys
    .clickOn('1')
    .clickOn('2')
    .then(function() {
      assert.equal(page.screen, '12');
    });

  return ( window as any ).wait();
});

test('fill in by attribute', async function(assert) {
  let page = PageObject.create({
    visit: visitable('/inputs'),
    fillIn: fillable()
  });

  await page.visit();

  await page
    .fillIn('input1', 'input 1')
    .fillIn('input2', 'input 2')
    .fillIn('input3', 'input 3')
    .fillIn('input4', 'input 4')
    .fillIn('input5', 'input 5');

  assert.dom('.input1-value').hasValue('input 1');
  assert.dom('.input2-value').hasValue('input 2');
  assert.dom('.input3-value').hasValue('input 3');
  assert.dom('.input4-value').hasValue('input 4');
  assert.dom('.input5-value').hasValue('input 5');

  await page
    .fillIn('textarea1', 'textarea 1')
    .fillIn('textarea2', 'textarea 2')
    .fillIn('textarea3', 'textarea 3')
    .fillIn('textarea4', 'textarea 4')
    .fillIn('textarea5', 'textarea 5');

  assert.dom('.textarea1-value').hasValue('textarea 1');
  assert.dom('.textarea2-value').hasValue('textarea 2');
  assert.dom('.textarea3-value').hasValue('textarea 3');
  assert.dom('.textarea4-value').hasValue('textarea 4');
  assert.dom('.textarea5-value').hasValue('textarea 5');

  await page
    .fillIn('contenteditable1', 'contenteditable 1')
    .fillIn('contenteditable2', 'contenteditable 2')
    .fillIn('contenteditable3', 'contenteditable 3')
    .fillIn('contenteditable4', 'contenteditable 4')
    .fillIn('contenteditable5', 'contenteditable 5');

  assert.dom('.contenteditable1-content').hasText('contenteditable 1');
  assert.dom('.contenteditable2-content').hasText('contenteditable 2');
  assert.dom('.contenteditable3-content').hasText('contenteditable 3');
  assert.dom('.contenteditable4-content').hasText('contenteditable 4');
  assert.dom('.contenteditable5-content').hasText('contenteditable 5');

  await page
    .fillIn('select1', 'select 1 option 2')
    .fillIn('select2', 'select 2 option 2')
    .fillIn('select3', 'select 3 option 2')
    .fillIn('select4', 'select 4 option 2')
    .fillIn('select5', 'select 5 option 2');

  assert.dom('.select1-value').hasValue('select 1 option 2');
  assert.dom('.select2-value').hasValue('select 2 option 2');
  assert.dom('.select3-value').hasValue('select 3 option 2');
  assert.dom('.select4-value').hasValue('select 4 option 2');
  assert.dom('.select5-value').hasValue('select 5 option 2');
});
