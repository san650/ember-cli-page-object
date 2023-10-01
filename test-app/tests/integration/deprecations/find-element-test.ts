import { module, test } from 'qunit';
import { create } from 'ember-cli-page-object';
import deprecate from 'ember-cli-page-object/-private/deprecate';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import { findElement, findElementWithAssert } from 'ember-cli-page-object/extend';
import { setupRenderingTest } from '../../helpers';

module('Deprecation | find-element', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    deprecate.__calls = [];
  });

  hooks.afterEach(function () {
    delete deprecate.__calls;
  });

  test('findElement', async function (assert) {
    await render(hbs`<span></span>`);

    findElement(create(), 'span');

    assert.deepEqual(deprecate.__calls, [
      [
        "find-element",
        "`findElement(` is deprecated. Please, consider using the `findOne(` or `findMany(` instead.",
        "2.2.0",
        "3.0.0"
      ],
    ]);
  });

  test('findElementWithAssert', async function (assert) {
    await render(hbs`<span></span>`);

    findElementWithAssert(create(), 'span');

    assert.deepEqual(deprecate.__calls, [
      [
        "find-element",
        "`findElementWithAssert(` is deprecated. Please, consider using the `findOne(` instead.",
        "2.2.0",
        "3.0.0"
      ],
    ]);
  });
});
