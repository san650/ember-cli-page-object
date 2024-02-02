import { module, test } from 'qunit';
import { collection, create } from 'ember-cli-page-object';

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

  test('throws in collection string property', function (assert) {
    const po = create({
      items: collection('.items', {
        stringProp: '',
      }),
    });

    assert.throws(
      () => po.items[0]?.stringProp,
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

  test('allows native getter', function (assert) {
    const po = create({
      get foo() {
        return 'bar';
      },
    });

    assert.strictEqual(po.foo, 'bar');
  });

  test('allows nested native getter', function (assert) {
    const po = create({
      nested: {
        get foo() {
          return 'bar';
        },
      },
    });

    assert.strictEqual(po.nested.foo, 'bar');
  });

  test('allows native getter in collection', function (assert) {
    const po = create({
      items: collection('.items', {
        get foo() {
          return 'bar';
        },
      }),
    });

    assert.strictEqual(po.items[0]?.foo, 'bar');
  });
});
