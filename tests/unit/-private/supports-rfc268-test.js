import { test, module } from 'qunit';
import { setupTest } from 'ember-qunit';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  module('Unit | supports rfc268', function(hooks) {
    function supportsRfc268() {
      window.require.unsee('ember-cli-page-object/test-support/-private/execution_context');
      return require('ember-cli-page-object/test-support/-private/execution_context').supportsRfc268();
    }

    hooks.afterEach(function() {
      // Make sure we don't leave this module in a mutated state
      window.require.unsee('ember-cli-page-object/test-support/-private/execution_context');
    });

    module('with context', function(hooks) {
      setupTest(hooks);

      let compatModule;
      let originalVisit;

      hooks.beforeEach(function() {
        compatModule = require('ember-cli-page-object/test-support/-private/compatibility');
        originalVisit = compatModule.visit;
      });

      hooks.afterEach(function() {
        compatModule.visit = originalVisit;
      });

      test('works', function(assert) {
        assert.ok(supportsRfc268());
      });

      test('throws without visit() present', function(assert) {
        compatModule.visit = undefined;

        assert.throws(() => supportsRfc268());
      });
    });

    module('without context', function() {
      test('works', function(assert) {
        assert.notOk(supportsRfc268());
      });
    });
  });
}
