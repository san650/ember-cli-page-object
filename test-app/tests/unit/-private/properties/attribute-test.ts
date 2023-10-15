import { setupRenderingTest } from '../../../helpers';
import { create, attribute } from 'ember-cli-page-object';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('attribute', function (hooks) {
  setupRenderingTest(hooks);

  test('returns attribute value', async function (assert) {
    let page = create({
      foo: attribute('placeholder', ':input'),
    });

    await render(hbs`<input placeholder="a value">`);

    assert.strictEqual(page.foo, 'a value');
  });

  test("returns null when attribute doesn't exist", async function (assert) {
    let page = create({
      placeholder: attribute('placeholder', ':input'),
      disabled: attribute('placeholder', ':input'),
    });

    await render(hbs`<input>`);

    assert.strictEqual(page.placeholder, undefined);
    assert.strictEqual(page.disabled, undefined);
  });

  test("raises an error when the element doesn't exist", async function (assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: attribute('placeholder', ':input'),
          },
        },
      },
    });

    await render(hbs``);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function (assert) {
    let page = create({
      foo: attribute('placeholder', ':input', { scope: '.scope' }),
    });

    await render(hbs`
      <div><input></div>
      <div class="scope"><input placeholder="a value"></div>
      <div><input></div>
    `);

    assert.strictEqual(page.foo, 'a value');
  });

  test("looks for elements inside page's scope", async function (assert) {
    let page = create({
      scope: '.scope',

      foo: attribute('placeholder', ':input'),
    });

    await render(hbs`
      <div><input></div>
      <div class="scope"><input placeholder="a value"></div>
      <div><input></div>
    `);

    assert.strictEqual(page.foo, 'a value');
  });

  test('resets scope', async function (assert) {
    let page = create({
      scope: '.scope',

      foo: attribute('placeholder', ':input', { resetScope: true }),
    });

    await render(hbs`
      <div class="scope"></div>
      <div><input placeholder="a value"></div>
    `);

    assert.strictEqual(page.foo, 'a value');
  });

  test('throws error if selector matches more than one element', async function (assert) {
    let page = create({
      foo: attribute('placeholder', ':input'),
    });

    await render(hbs`
      <input placeholder="a value">
      <input placeholder="other value">
    `);

    assert.throws(
      () => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./
    );
  });

  test('finds element by index', async function (assert) {
    let page = create({
      foo: attribute('placeholder', ':input', { at: 1 }),
    });

    await render(hbs`
      <input>
      <input placeholder="a value">
    `);

    assert.strictEqual(page.foo, 'a value');
  });

  test('looks for elements outside the testing container', async function (assert) {
    let page = create({
      foo: attribute('placeholder', ':input', {
        testContainer: '#alternate-ember-testing',
      }),
    });

    await render(hbs``);

    (document.getElementById('alternate-ember-testing') as HTMLElement)
      .innerHTML = `<input placeholder="a value">`;

    assert.strictEqual(page.foo, 'a value');
  });

  test('no value attributes', async function (assert) {
    let page = create({
      scope: 'span',
      disabled: attribute('disabled'),
      datatest: attribute('data-test'),
    });

    await render(hbs`<span disabled data-test></span>`);

    assert.strictEqual(page.disabled, 'disabled');
    assert.strictEqual(page.datatest, '');
  });

  test('uppercase', async function (assert) {
    let page = create({
      scope: 'span',
      disabled: attribute('DISABLED'),
      withValueSpecified: attribute('DATA-TEST')
    });

    await render(hbs`<span disabled data-test="test" ></span>`);

    assert.strictEqual(page.disabled, 'disabled');
    assert.strictEqual(page.withValueSpecified, 'test');
  });

  module('tabindex', function () {
    test('no value', async function (assert) {
      let page = create({
        scope: 'span',
        tabindex: attribute('tabindex'),
      });

      await render(hbs`<span tabindex></span>`);

      assert.strictEqual(page.tabindex, '');
    });

    test('with value', async function (assert) {
      let page = create({
        scope: 'span',
        tabindex: attribute('tabindex'),
      });

      await render(hbs`<span tabindex="0"></span>`);

      assert.strictEqual(page.tabindex, '0');
    });

    test('uppercase', async function (assert) {
      let page = create({
        scope: 'span',
        tabindex: attribute('TABINDEX'),
      });

      await render(hbs`<span tabindex></span>`);

      assert.strictEqual(page.tabindex, '');
    });
  })
});
