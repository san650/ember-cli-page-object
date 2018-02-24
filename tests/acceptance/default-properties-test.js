import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import PageObject from 'ember-cli-page-object';

moduleForAcceptance('Acceptance | default properties');

let {
  visitable
} = PageObject;

test('Adds default properties', async function(assert) {
  let page = PageObject.create({
    visit: visitable('/calculator'),

    one: {
      scope: '.numbers button:nth-of-type(1)'
    },

    screen: {
      scope: '.screen',

      expression: {
        scope: 'input'
      },

      result: {
        scope: '.result'
      }
    }
  });

  await page
    .visit()
    .clickOn('9')
    .one
    .click();

  await page.clickOn('=');

  assert.equal(page.screen.result.text, '91', 'text');
  assert.ok(page.screen.result.contains('91'), 'contains');
  assert.ok(!page.screen.result.contains('99'), 'not contains');
  assert.ok(page.screen.isPresent, 'isPresent');
  assert.ok(page.screen.isVisible, 'isVisible');
  assert.ok(!page.screen.isHidden, 'isHidden');
});

test('Overrides default properties', async function(assert) {
  let page = PageObject.create({
    dummy: {
      click() {
        return 'click';
      },
      clickOn() {
        return 'clickOn';
      },
      contains() {
        return 'contains';
      },
      isHidden() {
        return 'isHidden';
      },
      isPresent() {
        return 'isPresent';
      },
      isVisible() {
        return 'isVisible';
      },
      text() {
        return 'text';
      }
    }
  });

  assert.equal(page.dummy.click(), 'click');
  assert.equal(page.dummy.clickOn(), 'clickOn');
  assert.equal(page.dummy.contains(), 'contains');
  assert.equal(page.dummy.isHidden(), 'isHidden');
  assert.equal(page.dummy.isPresent(), 'isPresent');
  assert.equal(page.dummy.isVisible(), 'isVisible');
  assert.equal(page.dummy.text(), 'text');
});
