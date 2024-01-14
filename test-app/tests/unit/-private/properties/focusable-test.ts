import { create, focusable } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';

module('focusable', function (hooks) {
  setupRenderingTest(hooks);

  test('calls focus with proper args', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      foo: focusable('input'),
    });

    await this.createTemplate('<input />');

    find('input')?.addEventListener('focus', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test('actually focuses the element', async function (this: TestContext, assert) {
    assert.expect(2);

    const expectedSelector = 'input';
    const page = create({
      foo: focusable(expectedSelector),
    });

    await this.createTemplate('<input />');

    const input = find('input')!;

    input.addEventListener('focus', () => {
      assert.ok(1, 'focussed');
      assert.equal(document.activeElement, input);
    });

    await page.foo();
  });

  test('looks for elements inside the scope', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      foo: focusable('input', { scope: '.scope' }),
    });

    await this.createTemplate('<div class="scope"><input/></div>');

    find('.scope input')!.addEventListener('focus', () => assert.ok(1));
    await page.foo();
  });

  test("looks for elements inside page's scope", async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      scope: '.scope',

      foo: focusable('input'),
    });

    await this.createTemplate('<div class="scope"><input /></div>');

    find('.scope input')!.addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test('resets scope', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      scope: '.scope',
      foo: focusable('input', { resetScope: true }),
    });

    await this.createTemplate('<input/>');

    find('input')!.addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test('returns chainable object', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      foo: focusable('input'),
    });

    await this.createTemplate('<input/>');

    const ret = page.foo();

    assert.ok(ret.foo);

    return ret;
  });

  test('finds element by index', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      foo: focusable('input', { at: 3 }),
    });

    await this.createTemplate('<input /><input /><input /><input />');

    find('input:nth-of-type(4)')!.addEventListener('focus', () => assert.ok(1));
    await page.foo();
  });

  test('looks for elements outside the testing container', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      foo: focusable('input', { testContainer: '#alternate-ember-testing' }),
    });

    await this.createTemplate('<input />', { useAlternateContainer: true });

    document
      .querySelector('#alternate-ember-testing input')!
      .addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test('looks for elements within test container specified at node level', async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      testContainer: '#alternate-ember-testing',
      foo: focusable('input'),
    });

    await this.createTemplate('<input />', { useAlternateContainer: true });

    document
      .querySelector('#alternate-ember-testing input')!
      .addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test("raises an error when the element doesn't exist", async function (this: TestContext, assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          baz: {
            qux: focusable('button'),
          },
        },
      },
    });

    await this.createTemplate('');

    await assert.throws(
      function () {
        return page.foo.bar.baz.qux();
      },
      /page\.foo\.bar\.baz\.qux/,
      'Element not found'
    );
  });

  test('Does not raise error when focussing focusable elements', async function (this: TestContext, assert) {
    assert.expect(0);

    const page = create({
      foo: {
        bar: {
          input: focusable('input'),
          select: focusable('select'),
          a: focusable('a'),
          button: focusable('button'),
          contentEditable: focusable('[contenteditable]'),
          tabindex: focusable('[tabindex]'),
        },
      },
    });

    await this.createTemplate(`
      <input/>
      <a href="foo"></a>
      <select></select>
      <button></button>
      <div contenteditable></div>
      <div tabindex=-1></div>
    `);

    await page.foo.bar.input();
    await page.foo.bar.select();
    await page.foo.bar.a();
    await page.foo.bar.button();
    await page.foo.bar.contentEditable();
    await page.foo.bar.tabindex();
  });

  test('raises an error when the element is not focusable', async function (this: TestContext, assert) {
    assert.expect(2);

    const page = create({
      foo: {
        bar: {
          baz: focusable('span'),
          qux: focusable('input'),
          quux: focusable('button'),
          quuz: focusable('[contenteditable]'),
        },
      },
    });

    await this.createTemplate(`
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
