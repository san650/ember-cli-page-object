import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import { isOldEmber } from 'dummy/tests/helpers/is-old-ember';

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
  isVisible
} from 'dummy/tests/page-object';

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

moduleForComponent('calculating-device', 'Integration | component integration test support/actions', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});

test('Actions work when defined inside collections', function(assert) {
  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  page.render(template)
    .numbers(0)
    .click();

  assert.equal(page.screen.text, '1');
});

test('Chaining of actions inside a collection works', function(assert) {
  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  page.render(template)
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  assert.equal(page.screen.text, '123');
});

test('Chaining of actions on the root works', function(assert) {
  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  page.render(template)
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
  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  page.render(template)
    .calculator
    .clickOn('1')
    .clickOn('+')
    .clickOn('5')
    .clickOn('-')
    .clickOn('4')
    .clickOn('=');

  assert.equal(page.screen.text, '2');
});

test('Queries and actions handle non-existant elements correctly', function(assert) {
  assert.expect(12);

  const message = /Element #non-existant not found./;
  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  page.render(template);

  assert.throws(() => page.nonExistant.attribute(), message, 'attribute query did not throw an error');
  assert.throws(() => page.nonExistant.clickOnText('qux'), message, 'clickOnText action did not throw an error');
  assert.throws(() => page.nonExistant.clickable(), message, 'clickable action did not throw an error');
  assert.throws(() => page.nonExistant.contains('something'), message, 'contains action did not throw an error');
  assert.throws(() => page.nonExistant.fillable('baz'), message, 'fillable action did not throw an error');
  assert.throws(() => page.nonExistant.hasClass, message, 'hasClass query did not throw an error');
  assert.throws(() => page.nonExistant.notHasClass, message, 'notHasClass query did not throw an error');
  assert.throws(() => page.nonExistant.text, message, 'text query did not throw an error');
  assert.throws(() => page.nonExistant.value, message, 'value query did not throw an error');

  assert.equal(page.nonExistant.count, 0);
  assert.equal(page.nonExistant.isHidden, true);
  assert.equal(page.nonExistant.isVisible, false);
});
