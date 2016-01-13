import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from '../../page-object';

moduleForComponent('calculating-device', 'Integration | component integration test support/context', {
  integration: true
});

test('Test\'s `this` context can be passed to the page object', function(assert) {
  let page = PageObject.create({
    context: this
  });

  assert.ok(page.context);

  // The test's `this` context shouldn't be
  // altered or decorated during `create()`.
  // Should just be a reference to the test's `this`
  assert.equal(page.context, this);
});

test('Test\'s `this.$()` is accessible by the page object', function(assert) {
  let page = PageObject.create({
    context: this
  });

  this.render(hbs`{{calculating-device}}`);

  assert.ok(page.context.$());
  assert.deepEqual(page.context.$(), this.$());
});
