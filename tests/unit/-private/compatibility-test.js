import { test, module } from 'qunit';
import { wait } from 'ember-cli-page-object/-private/compatibility';

module('Unit | compatibility | wait');

// Under normal circumstances, `wait` is expected not to throw an error, since
// the necessary Ember test helpers are included by ember-qunit & ember-mocha.
test('does not throw', function(assert) {
  assert.expect(0);
  wait();
});

test('throws an error if test helpers are not available', function(assert) {
  const originalHasFn = window.require.has;
  window.require.has = () => false;
  window.require.unsee('ember-cli-page-object/-private/compatibility');
  const wait = window.require('ember-cli-page-object/-private/compatibility').wait;

  assert.throws(wait);
  window.require.has = originalHasFn;
});
