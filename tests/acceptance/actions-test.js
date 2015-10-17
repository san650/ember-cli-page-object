import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import PageObject from '../page-object';

module('Acceptance | actions', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

var {
  clickOnText,
  clickable,
  collection,
  customHelper,
  text,
  visitable
} = PageObject;

var button = customHelper(function(scope) {
  return {
    scope,

    click: clickable(),
    text: text()
  };
});

var page = PageObject.build({
  visit: visitable('/calculator'),

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

test('Actions defined inside collections work', function(assert) {
  page
    .visit()
    .numbers(1)
    .click();

  andThen(function() {
    assert.equal(page.screen().text(), '1');
  });
});

test('Chaining of actions inside a collection work', function(assert) {
  page
    .visit()
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  andThen(function() {
    assert.equal(page.screen().text(), '123');
  });
});

test('Chaining of actions on a component work', function(assert) {
  page
    .visit()
    .clickOn('1')
    .clickOn('+')
    .clickOn('4')
    .clickOn('-')
    .clickOn('2')
    .operators()
    .equals()
    .click();

  andThen(function() {
    assert.equal(page.screen().text(), '3');
  });
});
