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

test('allows to chain actions', function(assert) {
  page
    .visit()
    .keys
    .clickOn('1')
    .clickOn('2')
    .sum()
    .clickOn('3')
    .equal();

  andThen(function() {
    assert.equal(page.screen, '15');
  });

  page
    .fillValue('45')
    .keys
    .clickOn('6');

  andThen(function() {
    assert.equal(page.screen, '456');
  });
});

test('allows to chain aliased actions', function(assert) {
  page
    .visitAlias()
    .clickKeyAlias('1')
    .clickKeyAlias('2')
    .clickPlusAlias()
    .clickKeyAlias('3')
    .clickEqualAlias();

  andThen(function() {
    assert.equal(page.screen, '15');
  });
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

  return window.wait();
});

test('fill in by attribute', function(assert) {
  let page = PageObject.create({
    visit: visitable('/inputs'),
    fillIn: fillable()
  });

  page.visit();

  page
    .fillIn('input1', 'input 1')
    .fillIn('input2', 'input 2')
    .fillIn('input3', 'input 3')
    .fillIn('input4', 'input 4')
    .fillIn('input5', 'input 5');

  andThen(function() {
    assert.equal(find('.input1-value').val(), 'input 1');
    assert.equal(find('.input2-value').val(), 'input 2');
    assert.equal(find('.input3-value').val(), 'input 3');
    assert.equal(find('.input4-value').val(), 'input 4');
    assert.equal(find('.input5-value').val(), 'input 5');
  });

  page
    .fillIn('textarea1', 'textarea 1')
    .fillIn('textarea2', 'textarea 2')
    .fillIn('textarea3', 'textarea 3')
    .fillIn('textarea4', 'textarea 4')
    .fillIn('textarea5', 'textarea 5');

  andThen(function() {
    assert.equal(find('.textarea1-value').val(), 'textarea 1');
    assert.equal(find('.textarea2-value').val(), 'textarea 2');
    assert.equal(find('.textarea3-value').val(), 'textarea 3');
    assert.equal(find('.textarea4-value').val(), 'textarea 4');
    assert.equal(find('.textarea5-value').val(), 'textarea 5');
  });

  page
    .fillIn('contenteditable1', 'contenteditable 1')
    .fillIn('contenteditable2', 'contenteditable 2')
    .fillIn('contenteditable3', 'contenteditable 3')
    .fillIn('contenteditable4', 'contenteditable 4')
    .fillIn('contenteditable5', 'contenteditable 5');

  andThen(function() {
    assert.equal(find('.contenteditable1-content').html(), 'contenteditable 1');
    assert.equal(find('.contenteditable2-content').html(), 'contenteditable 2');
    assert.equal(find('.contenteditable3-content').html(), 'contenteditable 3');
    assert.equal(find('.contenteditable4-content').html(), 'contenteditable 4');
    assert.equal(find('.contenteditable5-content').html(), 'contenteditable 5');
  });

  page
    .fillIn('select1', 'select 1 option 2')
    .fillIn('select2', 'select 2 option 2')
    .fillIn('select3', 'select 3 option 2')
    .fillIn('select4', 'select 4 option 2')
    .fillIn('select5', 'select 5 option 2');

  andThen(function() {
    assert.equal(find('.select1-value').val(), 'select 1 option 2');
    assert.equal(find('.select2-value').val(), 'select 2 option 2');
    assert.equal(find('.select3-value').val(), 'select 3 option 2');
    assert.equal(find('.select4-value').val(), 'select 4 option 2');
    assert.equal(find('.select5-value').val(), 'select 5 option 2');
  });
});
