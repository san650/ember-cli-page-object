import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from '../../page-object';

moduleForComponent('calculating-device', 'Integration | component integration test support/actions', {
  integration: true
});

const {
  clickOnText,
  clickable,
  collection,
  customHelper,
  text
} = PageObject;

const button = customHelper(function(scope) {
  return {
    scope,

    click: clickable(),
    text: text()
  };
});

const Page = PageObject.extend({
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
  let page = Page.create({context: this});

  this.render(hbs`{{calculating-device}}`);

  page
    .numbers(1)
    .click();

  andThen(function() {
    assert.equal(page.screen().text(), '1');
  });
});

test('Chaining of actions inside a collection work', function(assert) {
  let page = Page.create({context: this});

  this.render(hbs`{{calculating-device}}`);

  page
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  andThen(function() {
    assert.equal(page.screen().text(), '123');
  });
});

test('Chaining of actions on a component work', function(assert) {
  let page = Page.create({context: this});

  this.render(hbs`{{calculating-device}}`);

  page
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
