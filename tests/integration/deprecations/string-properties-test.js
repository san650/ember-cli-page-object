import { module, test } from 'qunit';
import { create } from 'ember-cli-page-object';
import deprecate from 'ember-cli-page-object/-private/deprecate';

module('Deprecation | string-properties', function (hooks) {
  hooks.beforeEach(function () {
    deprecate.__calls = [];
  });

  hooks.afterEach(function () {
    delete deprecate.__calls;
  });

  test('works at top-level', function (assert) {
    this.page = create({
      stringProp: '',
    });

    // @todo: figure out and fix double deprecations
    assert.deepEqual(deprecate.__calls, [
      [
        'string-properties-on-definition',
        'do not use string values on definitions',
        '1.17.0',
        '2.0.0',
      ],
      [
        'string-properties-on-definition',
        'do not use string values on definitions',
        '1.17.0',
        '2.0.0',
      ],
    ]);
  });

  test('works for nested definitions', function (assert) {
    this.page = create({
      nested: {
        stringProp: '',
      },
    });

    // @todo: figure out and fix double deprecations
    assert.deepEqual(deprecate.__calls, [
      [
        'string-properties-on-definition',
        'do not use string values on definitions',
        '1.17.0',
        '2.0.0',
      ],
      [
        'string-properties-on-definition',
        'do not use string values on definitions',
        '1.17.0',
        '2.0.0',
      ],
    ]);
  });

  test('allows scope', function (assert) {
    this.page = create({
      scope: '',
    });

    assert.deepEqual(deprecate.__calls, []);
  });

  test('allows testContainer', function (assert) {
    this.page = create({
      testContainer: '',
    });

    assert.deepEqual(deprecate.__calls, []);
  });
});
