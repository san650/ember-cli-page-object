import { test, module } from 'qunit';
import require from 'require';
import deprecate from 'ember-cli-page-object/test-support/-private/deprecate';

module('Deprecation | test-support', function (hooks) {
  hooks.beforeEach(function () {
    deprecate.__calls = [];
  });

  hooks.afterEach(function () {
    delete deprecate.__calls;
  });

  test('import from test-support leads to the deprecation', function (assert) {
    // Currently addon-exports-test statically imports `dummy/tests/page-object`.
    // That leads to pre-loading and caching of the `dummy/tests/page-object` module
    // on the tests startup phase.Then if we tryto  access this module again
    // w/o cleaning the cache we won't be able to catch a deprecation.
    window.require.unsee('dummy/tests/page-object');

    require('dummy/tests/page-object');

    assert.deepEqual(deprecate.__calls, [
      [
        'import-from-test-support',
        'Importing from "test-support" is now deprecated. Please import directly from the "ember-cli-page-object" module instead.',
        '1.16.0',
        '2.0.0',
      ],
    ]);
  });
});
