import { moduleForComponent, test } from 'ember-qunit';
import { createCalculatorTemplate } from './test-helper';

import PageObject from 'dummy/tests/page-object';

moduleForComponent('calculating-device', 'Integration | default properties', {
  integration: true
});

test('Adds default properties', function(assert) {
  let page = PageObject.create({
    context: this,

    one: {
      scope: '.numbers button:nth-of-type(1)'
    },

    screen: {
      scope: '.screen'
    }
  });

  page
    .render(createCalculatorTemplate())
    .clickOn('9')
    .one
    .click();

  assert.equal(page.screen.text, '91', 'text');
  assert.ok(page.screen.contains('91'), 'contains');
  assert.notOk(page.screen.contains('99'), 'not contains');
  assert.ok(page.screen.isPresent, 'isPresent');
  assert.ok(page.screen.isVisible, 'isVisible');
  assert.notOk(page.screen.isHidden, 'isHidden');
});

test('Overrides default properties', function(assert) {
  let page = PageObject.create({
    context: this,

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
