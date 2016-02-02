import { moduleForComponent, test } from 'ember-qunit';
import { skip } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import { isOldEmber } from 'dummy/tests/helpers/is-old-ember';

import PageObject from '../../page-object';

const {
  clickOnText,
  clickable,
  collection,
  text
} = PageObject;

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

  clickOn: clickOnText('.calculator')
});

moduleForComponent('calculating-device', 'Integration | component integration test support/actions', {
  integration: true,

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

  page.setContext(this)
    .render(template)
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

  page.setContext(this)
    .render(template)
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  assert.equal(page.screen.text, '123');
});

test('Chaining of actions on a component works', function(assert) {
  let template;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  page.setContext(this)
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

skip('When a query is called on an element that doesn\'t exist in the DOM, an equivalent to `findWithAssert() is used`');
