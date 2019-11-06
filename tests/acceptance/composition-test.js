import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

import {
  create,
  collection,
  visitable,
  text,
  clickable,
  value,
  fillable,
  clickOnText
} from 'ember-cli-page-object';

let keyboard = create({
  scope: '.keyboard',
  numbers: collection(".numbers button", {
    text: text(),
    click: clickable()
  }),
  operators: collection(".operators button", {
    text: text()
  }),
  clickOn: clickOnText('.numbers'),
  sum: clickable('button', { scope: '.operators', at: 0 }),
  equal: clickable('button', { scope: '.operators', at: 2 })
});

let screenPage = create({
  value: value('.screen input'),
  fillValue: fillable('.screen input')
});
let page = create({
  visit: visitable('/calculator'),
  keys: keyboard,
  screen: screenPage
});

moduleForAcceptance('Acceptance | composition');

test('allows compose', async function(assert) {
  await page
    .visit()
    .keys
    .clickOn('1')
    .clickOn('2')
    .sum();
  assert.equal(page.element.classNames.toString(), 'keyboard');

  //click 3
  await page.keys.numbers.objectAt(2).click()
  //click =
  await page.keys.operators.objectAt(3).click();
  assert.equal(page.screen.value, '15');

  await page.screen.fillValue('45')
  //click 6
  await page.keys.numbers.objectAt(5).click();

  assert.equal(page.screen.value, '456');
});

