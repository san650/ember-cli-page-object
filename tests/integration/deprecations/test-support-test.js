import { test, module } from 'qunit';
import require from 'require';

module('Deprecation | test-support');

test('import from test-support leads to the deprecation', function(assert) {
  // Currently addon-exports-test statically imports `dummy/tests/page-object`.
  // That leads to pre-loading and caching of the `dummy/tests/page-object` module
  // on the tests startup phase.Then if we tryto  access this module again
  // w/o cleaning the cache we won't be able to catch a deprecation.
  window.require.unsee('dummy/tests/page-object');

  require('dummy/tests/page-object');

  assert.expectDeprecation(`Importing from "test-support" is now deprecated. Please import directly from the "ember-cli-page-object" module instead.`);
})
