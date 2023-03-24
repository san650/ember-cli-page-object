import { test, module } from 'qunit';
import { create } from 'ember-cli-page-object';
import { throwBetterError } from 'ember-cli-page-object/-private/better-errors';

const page = create({
  foo: {
    scope: '.foo',
    bar: {
      scope: '.bar',
      focus() {},
    },
  },
});

module('Unit | throwBetterError', function () {
  test('shows the expected error message when `selector` is not passed in', function (assert) {
    assert.expect(1);

    const fn = () => {
      throwBetterError(page.foo.bar, 'focus', 'Oops!');
    };
    const expectedError = new RegExp(
      `Oops!\n\nPageObject: 'page.foo.bar.focus'`
    );

    assert.throws(fn, expectedError, 'should show message & property path');
  });

  test('accepts Error instance', function (assert) {
    assert.expect(2);

    const sourceError = new Error('Oops!');

    try {
      throwBetterError(page.foo.bar, 'focus', sourceError, {
        selector: '.foo .bar',
      });
    } catch (e) {
      assert.equal(
        e.toString(),
        "Error: Oops!\n\nPageObject: 'page.foo.bar.focus'\n  Selector: '.foo .bar'"
      );
      assert.equal(e.stack, sourceError.stack, 'stack is preserved');
    }
  });

  test('logs the error to the console', function (assert) {
    assert.expect(2);

    const origConsoleError = console.error;

    try {
      console.error = (msg) => {
        assert.equal(msg, "Error: Oops!\n\nPageObject: 'page.foo.bar.focus'");
      };

      assert.throws(() => throwBetterError(page.foo.bar, 'focus', 'Oops!'));
    } finally {
      console.error = origConsoleError;
    }
  });
});
