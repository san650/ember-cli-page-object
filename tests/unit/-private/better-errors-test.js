import Ember from 'ember';
import EmberError from '@ember/error';
import { test, module } from 'qunit';
import { create } from 'ember-cli-page-object';
import {
  throwBetterError
} from 'ember-cli-page-object/test-support/-private/better-errors';

const { Logger } = Ember;

const page = create({
  foo: {
    scope: '.foo',
    bar: {
      scope: '.bar',
      focus() {}
    }
  }
});

module('Unit | throwBetterError');

test('shows the expected error message when `selector` is not passed in', function(assert) {
  assert.expect(1);

  const fn = () => {
    throwBetterError(page.foo.bar, 'focus', 'Oops!');
  };
  const expectedError = new EmberError(
    "Oops!\n\nPageObject: 'page.foo.bar.focus'"
  );

  assert.throws(fn, expectedError, 'should show message & property path');
});

test('shows the expected error message when `selector` is passed in', function(assert) {
  assert.expect(1);

  const fn = () => {
    throwBetterError(page.foo.bar, 'focus', 'Oops!', { selector: '.foo .bar' });
  };
  const expectedError = new EmberError(
    "Oops!\n\nPageObject: 'page.foo.bar.focus'\n  Selector: '.foo .bar'"
  );

  assert.throws(fn, expectedError, 'should show message, property path, & selector');
});

test('logs the error to the console', function(assert) {
  assert.expect(2);

  const origEmberLoggerError = Logger.error;

  try {
    Logger.error = (msg) => {
      assert.equal(msg, "Oops!\n\nPageObject: 'page.foo.bar.focus'");
    };

    assert.throws(() => throwBetterError(page.foo.bar, 'focus', 'Oops!'));
  } finally {
    Logger.error = origEmberLoggerError;
  }
});
