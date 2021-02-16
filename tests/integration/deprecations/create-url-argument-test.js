import { module, test } from 'qunit';
import { create } from 'ember-cli-page-object';
import deprecate from 'ember-cli-page-object/test-support/-private/deprecate';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  module('Deprecation | create url argument', function(hooks) {
    hooks.beforeEach(function() {
      deprecate.__calls = [];
    });

    hooks.afterEach(function() {
      delete deprecate.__calls;
    });

    test('it shows deprecation', async function(assert) {
      create('');

      assert.deepEqual(deprecate.__calls, [
        [
          'create-url-argument',
          'Passing an URL argument to `create()` is deprecated',
          '1.17.0',
          '2.0.0'
        ]
      ])
    });

    test('it does not show deprecation', async function(assert) {
      create();
      create({});

      assert.deepEqual(deprecate.__calls, [])
    });
  });
}
