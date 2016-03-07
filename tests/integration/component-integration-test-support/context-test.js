import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import { isOldEmber } from 'dummy/tests/helpers/is-old-ember';

import PageObject from 'dummy/tests/page-object';

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

test('`setContext(this)` and `removeContext()` set and remove the test context from the page', function(assert) {
  assert.expect(3);

  const page = PageObject.create({});

  assert.notOk(page.context);

  page.setContext(this);

  assert.deepEqual(page.context, this);

  page.removeContext();

  assert.notOk(page.context);
});

test('`render()` throws an error when no context has been set', function(assert) {
  assert.expect(2);

  let template;
  let errorMessage;

  if (isOldEmber) {
    template = Ember.HTMLBars.compile('{{calculating-device}}');
  } else {
    template = hbs`{{calculating-device}}`;
  }

  const page = PageObject.create({});

  assert.notOk(page.context);

  assert.throws(function() {
    page.render(template);
  }, function(err) {
    errorMessage = err.message;

    return errorMessage === 'You must set a context on the page object before calling calling `render()`';
  }, `render did not throw an error when no context was set. Actual message: ${errorMessage}`);
});
