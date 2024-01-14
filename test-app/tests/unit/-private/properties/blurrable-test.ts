import { create, blurrable, focusable } from 'ember-cli-page-object';
import { setupRenderingTest } from '../../../helpers';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('blurrable', function (hooks) {
  setupRenderingTest(hooks);

  test('calls blur with proper args', async function (assert) {
    assert.expect(1);

    const expectedSelector = 'input';
    const page = create({
      foo: blurrable(expectedSelector),
    });

    await render(hbs`<input />`);

    const element = find(expectedSelector) as HTMLElement;
    element.focus();
    element.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test('actually blurs the element', async function (assert) {
    assert.expect(2);

    const expectedSelector = 'input';
    const page = create({
      foo: blurrable(expectedSelector),
    });

    await render(hbs`<input />`);

    const element = find(expectedSelector) as HTMLElement;
    element.focus();
    element.addEventListener('blur', () => {
      assert.ok(1, 'blurred');
      assert.equal(document.activeElement, document.body);
    });

    await page.foo();
  });

  test('looks for elements inside the scope', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: blurrable('input', { scope: '.scope' }),
    });

    await render(hbs`<div class="scope"><input/></div>`);

    const element = find('.scope input') as HTMLElement;
    element.focus();
    element.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test("looks for elements inside page's scope", async function (assert) {
    assert.expect(1);

    const page = create({
      scope: '.scope',

      foo: blurrable('input'),
    });

    await render(hbs`<div class="scope"><input /></div>`);

    const element = find('.scope input') as HTMLElement;
    element.focus();
    element.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test('resets scope', async function (assert) {
    assert.expect(1);

    const page = create({
      scope: '.scope',
      foo: blurrable('input', { resetScope: true }),
    });

    await render(hbs`<input/>`);

    const element = find('input') as HTMLElement;
    element.focus();
    element.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test('returns chainable object', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: blurrable('input'),
    });

    await render(hbs`<input/>`);

    const element = find('input') as HTMLElement;
    element.focus();

    assert.ok(page.foo);
  });

  test('finds element by index', async function (assert) {
    assert.expect(1);

    const page = create({
      blur: blurrable('input', { at: 3 }),
      focus: focusable('input', { at: 3 }),
    });

    await render(hbs`<input /><input /><input /><input />`);

    await page.focus();

    const element = find('input:nth-of-type(4)') as HTMLElement;
    element.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.blur();
  });

  test('looks for elements outside the testing container', async function (assert) {
    assert.expect(1);

    const expectedContextId = 'alternate-ember-testing';
    const page = create({
      foo: blurrable('input', { testContainer: `#${expectedContextId}` }),
    });

    const expectedContext = document.getElementById(expectedContextId)!;
    expectedContext.innerHTML = `<input />`;
    const input = expectedContext.querySelector('input') as HTMLElement;
    input.focus();
    input.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test('looks for elements within test container specified at node level', async function (assert) {
    assert.expect(1);

    const expectedContext = '#alternate-ember-testing';
    const page = create({
      testContainer: expectedContext,
      foo: blurrable('input'),
    });

    const alternatveContainer = document.getElementById(
      'alternate-ember-testing'
    )!;
    alternatveContainer.innerHTML = `<input />`;

    const element = alternatveContainer?.querySelector('input') as HTMLElement;
    element.focus();
    element.addEventListener('blur', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test("raises an error when the element doesn't exist", async function (assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          baz: {
            qux: blurrable('button'),
          },
        },
      },
    });

    await render(hbs``);

    // @todo: make pass for `assert.rejects()`
    await assert.throws(
      () => page.foo.bar.baz.qux(),
      /page\.foo\.bar\.baz\.qux/,
      'Element not found'
    );
  });

  test('raises an error when the element is not focusable', async function (assert) {
    const page = create({
      foo: {
        bar: {
          baz: blurrable('span'),
          qux: blurrable('input'),
          quux: blurrable('button'),
          quuz: blurrable('[contenteditable]'),
        },
      },
    });

    await render(hbs`
      <span></span>
      <input disabled=true/>
      <button style="display: none;"></button>
      <div contenteditable="false"></div>
    `);

    await assert.rejects(
      page.foo.bar.baz() as unknown as Promise<unknown>,
      /page\.foo\.bar\.baz/,
      'Element is not focusable because it is not a link'
    );

    await assert.rejects(
      page.foo.bar.quuz() as unknown as Promise<unknown>,
      /page\.foo\.bar\.quuz/,
      'Element is not focusable because it is contenteditable="false"'
    );
  });
});
