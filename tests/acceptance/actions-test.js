import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import PageObject from '../page-object';

moduleForAcceptance('Acceptance | actions');

var {
  clickOnText,
  clickable,
  fillable,
  value,
  visitable
} = PageObject;

var page = PageObject.create({
  visit: visitable('/calculator'),
  keys: {
    clickOn: clickOnText('.numbers'),
    sum: clickable('button', { scope: '.operators', at: 0 }),
    equal: clickable('button', { scope: '.operators', at: 2 })
  },

  screen: value('.screen input'),
  fillValue: fillable('.screen input')
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
