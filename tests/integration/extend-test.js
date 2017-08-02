import { moduleForComponent, test } from 'ember-qunit';
import { createCalculatorTemplate } from './test-helper';

import PageObject from 'dummy/tests/page-object';

moduleForComponent('calculating-device', 'Integration | extend', {
  integration: true
});

test('Supports nested objects', function(assert) {
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
