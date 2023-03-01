import { module, test } from 'qunit';
import { create } from 'ember-cli-page-object';

module('string-properties', function () {
  test('throws in top-level string property', function (assert) {
    assert.throws(
      () => create({ stringProp: '' }),
      new Error(`string values are not supported in page object definitions

Key: "stringProp"`)
    );
  });

  test('throws in nested string property', function (assert) {
    assert.throws(
      () =>
        create({
          nested: {
            stringProp: '',
          },
        }),
      new Error(`string values are not supported in page object definitions

Key: "stringProp"`)
    );
  });

  test('allows scope', function (assert) {
    create({
      scope: '',
    });

    assert.true(true);
  });

  test('allows testContainer', function (assert) {
    create({
      testContainer: '',
    });

    assert.true(true);
  });
});
