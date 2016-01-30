import { moduleForComponent, test } from 'ember-qunit';
import { skip } from 'qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from '../../page-object';

moduleForComponent('calculating-device', 'Integration | component integration test support/actions', {
  integration: true
});

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

// TODO: Re-add this `Page` subclass using `extend` when `extend`
// support has been added
//
// const Page = PageObject.extend({
//   numbers: collection({
//     scope: '.numbers',
//     itemScope: 'button',
//
//     item: {
//       click: clickable(),
//       text: text()
//     },
// 
//     clickOn: clickOnText()
//   }),
// 
//   operators: {
//     scope: '.operators',
// 
//     plus: button('button:nth-of-type(1)'),
//     minus: button('button:nth-of-type(2)'),
//     equals: button('button:nth-of-type(3)')
//   },
// 
//   screen: {
//     text: text('.screen')
//   },
// 
//   clickOn: clickOnText('.calculator')
// });

test('Actions work when defined inside collections', function(assert) {
  // TODO: replace the non-DRY `create` with the short version
  // after `extend` support has been added
  //
  // let page = Page.create({context: this});
  //
  const page = PageObject.create({
    context: this,

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

  this.render(hbs`{{calculating-device}}`);

  page
    .numbers(0)
    .click();

  assert.equal(page.screen.text, '1');
});

test('Chaining of actions inside a collection works', function(assert) {
  // TODO: replace the non-DRY `create` with the short version
  // after `extend` support has been added
  //
  // let page = Page.create({context: this});
  //
  const page = PageObject.create({
    context: this,

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

  this.render(hbs`{{calculating-device}}`);

  page
    .numbers()
    .clickOn('1')
    .clickOn('2')
    .clickOn('3');

  assert.equal(page.screen.text, '123');
});

test('Chaining of actions on a component work', function(assert) {
  // TODO: replace the non-DRY `create` with the short version
  // after `extend` support has been added
  //
  // let page = Page.create({context: this});
  //
  const page = PageObject.create({
    context: this,

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

  this.render(hbs`{{calculating-device}}`);

  page
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
