import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { createCalculatorTemplate } from './test-helper';

import { create } from 'ember-cli-page-object';

module('Integration | default properties', function(hooks) {
  setupRenderingTest(hooks);

  test('Adds default properties', async function(assert) {
    let page = create({
      context: this,

      one: {
        scope: '.numbers button:nth-of-type(1)'
      },

      screen: {
        scope: '.screen'
      }
    });

    await render(createCalculatorTemplate());

    await page
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
    let page = create({
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
});
