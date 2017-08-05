import { moduleForComponent, test } from 'ember-qunit';
import { createCalculatorTemplate } from './test-helper';

import PageObject from 'dummy/tests/page-object';

moduleForComponent('calculating-device', 'Integration | extend', {
  integration: true
});

test('Supports extending', function(assert) {
  const ScreenPageObject = PageObject.extend({
    isNine() {
      return this.text === '9';
    },
  });

  const page = PageObject.create({
    context: this,

    getScreen() {
      return ScreenPageObject.create({
        context: this.context,
        scope: '.screen',
      });
    },

  });

  const isNine = page
    .render(createCalculatorTemplate())
    .clickOn('9')
    .getScreen()
    .isNine();

  assert.ok(isNine, 'should be nine');
});

test('Supports multiple extending', function(assert) {
  const ScreenPageObject = PageObject.extend({
    isNumber(number) {
      return this.text === String(number);
    },
  });

  const CustomScreenPageObject = ScreenPageObject.extend({
    isNine() {
      return this.isNumber(9);
    }
  });

  const page = PageObject.create({
    context: this,

    getScreen() {
      return CustomScreenPageObject.create({
        context: this.context,
        scope: '.screen',
      });
    },

  });

  const isNine = page
    .render(createCalculatorTemplate())
    .clickOn('9')
    .getScreen()
    .isNine();

  assert.ok(isNine, 'should be nine');
});
