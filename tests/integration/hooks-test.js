import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createCalculatorTemplate } from './test-helper';

import PageObject, { setupPage } from 'ember-cli-page-object';

const page = PageObject.create({});

module('Integration | hooks', function(hooks) {
  setupRenderingTest(hooks);

  module('manually setting up a page', function(hooks) {
    let firstThis;
    let secondThis;

    hooks.beforeEach(function() {
      page.setContext(this);

      if (!firstThis) {
        firstThis = page.context;
      } else {
        secondThis = page.context;
      }
    });

    hooks.afterEach(function() {
      page.removeContext();
    });

    test('When set in the `beforeEach()` qunit hook, test\'s `this` context\'s methods are accessible to the page object', function(assert) {
      assert.expect(5);

      assert.ok(page.context);
      assert.deepEqual(this, page.context);
      assert.equal(page.context, firstThis);

      this.render(createCalculatorTemplate());

      assert.ok(page.context.$());
      assert.deepEqual(page.context.$(), this.$());
    });

    test('Setting the page\'s context in `beforeEach()` assigns the correct context in each test', function(assert) {
      assert.expect(6);

      assert.ok(page.context);
      assert.deepEqual(this, page.context);
      assert.equal(page.context, secondThis);
      assert.notEqual(page.context, firstThis);

      this.render(createCalculatorTemplate());

      assert.ok(page.context.$());
      assert.deepEqual(page.context.$(), this.$());
    });
  });

  module('using the `setupPage` helper', function(hooks) {
    setupPage(hooks, {});

    test('it sets the context of the page object', function(assert) {
      assert.equal(this.page.context, this);
    })
  });
});
