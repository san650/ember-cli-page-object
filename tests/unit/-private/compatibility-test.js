import { test, module } from 'qunit';
import { wait } from 'ember-cli-page-object/test-support/-private/compatibility';

module('Unit | compatibility', function(hooks) {
  let originalHasFn;

  hooks.beforeEach(function() {
    window.require.unsee('ember-cli-page-object/test-support/-private/compatibility');
    originalHasFn = window.require.has;
  });
  hooks.afterEach(function() {
    window.require.has = originalHasFn;
    // So it doesn't stay cached with exports based on a stubbed require.has
    window.require.unsee('ember-cli-page-object/test-support/-private/compatibility');
  });

  module('wait', function() {
    // Under normal circumstances, `wait` is expected not to throw an error, since
    // the necessary Ember test helpers are included by ember-qunit & ember-mocha.
    test('does not throw', function(assert) {
      assert.expect(0);
      wait();
    });

    test('throws an error if test helpers are not available', function(assert) {
      window.require.has = () => false;
      const wait = window.require('ember-cli-page-object/test-support/-private/compatibility').wait;

      assert.throws(wait);
    });
  });

  module('getContext', function() {
    test('exists and returns null if @ember/test-helpers are not available', function(assert) {
      window.require.has = () => false;
      const getContext = window.require('ember-cli-page-object/test-support/-private/compatibility').getContext;

      assert.notOk(getContext());
    });
  });
});
