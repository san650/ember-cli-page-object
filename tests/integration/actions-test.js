import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import { createTemplate } from './test-helper';
import { expectEmberError } from '../test-helper';

import PageObject, {
  collection,
  alias,
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
  let template = createTemplate();

  page
    .render(template)
    .numbers(0)
    .click();

  assert.equal(page.screen.text, '1');
});

test('Chaining of actions inside a collection works', function(assert) {
  let template = createTemplate();

  page
    .render(template)
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  assert.equal(page.screen.text, '123');
});

test('Chaining of actions on the root works', function(assert) {
  let template = createTemplate();

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
  let template = createTemplate();

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
  let template = createTemplate();

  page
    .render(template)
    .clickOnAlias('1')
    .clickOnAlias('4');

  assert.equal(page.screen.text, '14');
});

test('Chaining of aliased component actions works', function(assert) {
  let template = createTemplate();

  page
    .render(template)
    .clickOn('1')
    .clickPlusAlias()
    .clickOn('4')
    .clickEqualsAlias();

  assert.equal(page.screen.text, '5');
});

test('Queries and actions handle non-existant elements correctly', function(assert) {
  assert.expect(12);

  let message = /Element not found./;
  let template = createTemplate();

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
