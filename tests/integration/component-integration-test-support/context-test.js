import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import { isOldEmber } from 'dummy/tests/helpers/is-old-ember';

import PageObject from '../../page-object';

moduleForComponent('calculating-device', 'Integration | component integration test support/context', {
  integration: true
});

test('Test\'s `this` context\'s methods are accessible to the page object', function(assert) {
  assert.expect(2);

  const page = PageObject.create({
    context: this
  });

  assert.ok(page.context);

  assert.deepEqual(this, page.context);
});

test('Test\'s `this.$()` is accessible by the page object', function(assert) {
  assert.expect(2);

  const page = PageObject.create({
    context: this
  });

  if (isOldEmber) {
    this.render(Ember.HTMLBars.compile('{{calculating-device}}'));
  } else {
    this.render(hbs`{{calculating-device}}`);
  }

  assert.ok(page.context.$());
  assert.deepEqual(page.context.$(), this.$());
});
