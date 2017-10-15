import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import {
  createCalculatorTemplate,
  createInputsTemplate
} from './test-helper';
import expectEmberError from '../expect-ember-error';
import { alias } from 'ember-cli-page-object/macros';

import PageObject, {
  collection,
  attribute,
  clickOnText,
  clickable,
  contains,
  fillable,
  hasClass,
  notHasClass,
  text,
  value,
  count,
  isHidden,
  isPresent,
  isVisible
} from 'dummy/tests/page-object';

const { run } = Ember;

const button = function(scope) {
  return {
    scope,

    click: clickable(),
    text: text()
  };
};

const page = PageObject.create({
  numbers: collection({
    scope: '.numbers',
    itemScope: 'button',

    item: {
      click: clickable(),
      text: text()
    },

    clickOn: clickOnText()
  }),

  operators: {
    scope: '.operators',

    plus: button('button:nth-of-type(1)'),
    minus: button('button:nth-of-type(2)'),
    equals: button('button:nth-of-type(3)')
  },

  screen: {
    text: text('.screen')
  },

  clickOn: clickOnText('', { scope: '.calculator' }),

  calculator: {
    scope: '.calculator',

    clickOn: clickOnText()
  },

  clickOnAlias: alias('clickOn', { chainable: true }),
  clickPlusAlias: alias('operators.plus.click', { chainable: true }),
  clickEqualsAlias: alias('operators.equals.click', { chainable: true }),

  nonExistant: {
    scope: '#non-existant',

    // should throw an error
    attribute: attribute('an-attribute'),
    clickOnText: clickOnText(),
    clickable: clickable(),
    contains: contains(),
    fillable: fillable(),
    hasClass: hasClass('foo'),
    notHasClass: notHasClass('bar'),
    text: text(),
    value: value(),

    // should not throw an error
    count: count(),
    isHidden: isHidden(),
    isPresent: isPresent(),
    isVisible: isVisible()
  }
});

moduleForComponent('calculating-device', 'Integration | actions', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});

test('Actions work when defined inside collections', function(assert) {
  let template = createCalculatorTemplate();

  page
    .render(template)
    .numbers(0)
    .click();

  assert.equal(page.screen.text, '1');
});

test('Chaining of actions inside a collection works', function(assert) {
  let template = createCalculatorTemplate();

  page
    .render(template)
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  assert.equal(page.screen.text, '123');
});

test('Chaining of actions on the root works', function(assert) {
  let template = createCalculatorTemplate();

  page
    .render(template)
    .clickOn('1')
    .clickOn('+')
    .clickOn('4')
    .clickOn('-')
    .clickOn('2')
    .operators
    .equals
    .click();

  assert.equal(page.screen.text, '3');
});

test('Chaining of actions on a component works', function(assert) {
  let template = createCalculatorTemplate();

  page
    .render(template)
    .calculator
    .clickOn('1')
    .clickOn('+')
    .clickOn('5')
    .clickOn('-')
    .clickOn('4')
    .clickOn('=');

  assert.equal(page.screen.text, '2');
});

test('Chaining of aliased root actions works', function(assert) {
  let template = createCalculatorTemplate();

  page
    .render(template)
    .clickOnAlias('1')
    .clickOnAlias('4');

  assert.equal(page.screen.text, '14');
});

test('Chaining of aliased component actions works', function(assert) {
  let template = createCalculatorTemplate();

  page
    .render(template)
    .clickOn('1')
    .clickPlusAlias()
    .clickOn('4')
    .clickEqualsAlias();

  assert.equal(page.screen.text, '5');
});

test('fill in by attribute', function(assert) {
  let template = createInputsTemplate();

  page.render(template);

  page
    .fillIn('input1', 'input 1')
    .fillIn('input2', 'input 2')
    .fillIn('input3', 'input 3')
    .fillIn('input4', 'input 4')
    .fillIn('input5', 'input 5');

  assert.equal(Ember.$('.input1-value').val(), 'input 1');
  assert.equal(Ember.$('.input2-value').val(), 'input 2');
  assert.equal(Ember.$('.input3-value').val(), 'input 3');
  assert.equal(Ember.$('.input4-value').val(), 'input 4');
  assert.equal(Ember.$('.input5-value').val(), 'input 5');

  page
    .fillIn('textarea1', 'textarea 1')
    .fillIn('textarea2', 'textarea 2')
    .fillIn('textarea3', 'textarea 3')
    .fillIn('textarea4', 'textarea 4')
    .fillIn('textarea5', 'textarea 5');

  assert.equal(Ember.$('.textarea1-value').val(), 'textarea 1');
  assert.equal(Ember.$('.textarea2-value').val(), 'textarea 2');
  assert.equal(Ember.$('.textarea3-value').val(), 'textarea 3');
  assert.equal(Ember.$('.textarea4-value').val(), 'textarea 4');
  assert.equal(Ember.$('.textarea5-value').val(), 'textarea 5');

  page
    .fillIn('contenteditable1', 'contenteditable 1')
    .fillIn('contenteditable2', 'contenteditable 2')
    .fillIn('contenteditable3', 'contenteditable 3')
    .fillIn('contenteditable4', 'contenteditable 4')
    .fillIn('contenteditable5', 'contenteditable 5');

  assert.equal(Ember.$('.contenteditable1-content').html(), 'contenteditable 1');
  assert.equal(Ember.$('.contenteditable2-content').html(), 'contenteditable 2');
  assert.equal(Ember.$('.contenteditable3-content').html(), 'contenteditable 3');
  assert.equal(Ember.$('.contenteditable4-content').html(), 'contenteditable 4');
  assert.equal(Ember.$('.contenteditable5-content').html(), 'contenteditable 5');

  page
    .fillIn('select1', 'select 1 option 2')
    .fillIn('select2', 'select 2 option 2')
    .fillIn('select3', 'select 3 option 2')
    .fillIn('select4', 'select 4 option 2')
    .fillIn('select5', 'select 5 option 2');

  assert.equal(Ember.$('.select1-value').val(), 'select 1 option 2');
  assert.equal(Ember.$('.select2-value').val(), 'select 2 option 2');
  assert.equal(Ember.$('.select3-value').val(), 'select 3 option 2');
  assert.equal(Ember.$('.select4-value').val(), 'select 4 option 2');
  assert.equal(Ember.$('.select5-value').val(), 'select 5 option 2');
});

test('Queries and actions handle non-existant elements correctly', function(assert) {
  assert.expect(13);

  let message = /Element not found./;
  let template = createCalculatorTemplate();

  page.render(template);

  run(() => {
    assert.throws(() => page.nonExistant.attribute(), message, 'attribute query did not throw an error');
  });
  run(() => {
    expectEmberError(assert, () => page.nonExistant.clickOnText('qux'), message, 'clickOnText action did not throw an error');
  });
  run(() => {
    expectEmberError(assert, () => page.nonExistant.clickable(), message, 'clickable action did not throw an error');
  });
  run(() => {
    assert.throws(() => page.nonExistant.contains('something'), message, 'contains action did not throw an error');
  });
  run(() => {
    expectEmberError(assert, () => page.nonExistant.fillable('baz'), message, 'fillable action did not throw an error');
  });
  run(() => {
    assert.throws(() => page.nonExistant.hasClass, message, 'hasClass query did not throw an error');
  });
  run(() => {
    assert.throws(() => page.nonExistant.notHasClass, message, 'notHasClass query did not throw an error');
  });
  run(() => {
    assert.throws(() => page.nonExistant.text, message, 'text query did not throw an error');
  });
  run(() => {
    assert.throws(() => page.nonExistant.value, message, 'value query did not throw an error');
  });

  assert.equal(page.nonExistant.count, 0);
  assert.equal(page.nonExistant.isHidden, true);
  assert.equal(page.nonExistant.isVisible, false);
  assert.equal(page.nonExistant.isPresent, false);
});

moduleForComponent('calculating-device', 'Integration | actions', {
  integration: true,

  afterEach() {
    $('#alternate-ember-testing').html('');
  }
});

test('looks for elements outside the testing container', function(assert) {
  assert.expect(0);

  $('#alternate-ember-testing').html('<button>lorem</button><input>');

  let page = PageObject.create({
    context: this,
    clickOnText: clickOnText('button', { testContainer: '#alternate-ember-testing' }),
    clickable: clickable('button', { testContainer: '#alternate-ember-testing' }),
    fillable: fillable('input', { testContainer: '#alternate-ember-testing' })
  });

  page
    .clickOnText('lorem')
    .clickable()
    .fillable('foo');
});

test('looks for elements within test container specified at node level', function(assert) {
  assert.expect(0);

  $('#alternate-ember-testing').html('<button>lorem</button><input>');

  let page = PageObject.create({
    context: this,
    testContainer: '#alternate-ember-testing',
    clickOnText: clickOnText('button'),
    clickable: clickable('button'),
    fillable: fillable('input')
  });

  page
    .clickOnText('lorem')
    .clickable()
    .fillable('foo');
});
