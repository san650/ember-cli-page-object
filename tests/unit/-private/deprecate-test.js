import { module, test } from 'qunit';
import deprecate from 'ember-cli-page-object/test-support/-private/deprecate';

module('Unit | deprecate', function (hooks) {
  let origWarn, calls;

  hooks.beforeEach(function () {
    origWarn = console.warn;

    calls = [];
    console.warn = (...args) => {
      calls.push(args);
    };
  });

  hooks.afterEach(function () {
    console.warn = origWarn;
  });

  test('it renders', function (assert) {
    deprecate('a-name', 'a message', '1.1', '1.2.3');

    assert.equal(calls.length, 1);
    assert.equal(calls[0].length, 1);
    assert.equal(
      calls[0][0].split('\n')[0],
      'DEPRECATION: a message [deprecation id: ember-cli-page-object.a-name] See https://ember-cli-page-object.js.org/docs/v1.1.x/deprecations#a-name for more details.'
    );
  });

  module('tracking', function (hooks) {
    hooks.afterEach(function () {
      delete deprecate.__calls;
    });

    test('disabled by default', function (assert) {
      deprecate('a-name', 'a message', '1.1', '1.2.3');

      assert.strictEqual(deprecate.__calls, undefined);
    });

    test('it works', function (assert) {
      deprecate.__calls = [];
      deprecate('a-name', 'a message', '1.1', '1.2.3');

      assert.deepEqual(deprecate.__calls, [
        ['a-name', 'a message', '1.1', '1.2.3'],
      ]);
    });
  });
});
