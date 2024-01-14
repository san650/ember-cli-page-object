import { setupRenderingTest } from '../../../helpers';
import { create, clickable } from 'ember-cli-page-object';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('clickable', function (hooks) {
  setupRenderingTest(hooks);

  test('calls click helper', async function (assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      foo: clickable(expectedSelector),
    });

    await render(hbs`<button>Click me</button>`);

    find(expectedSelector)!.addEventListener('click', () => assert.ok(1), {
      once: true,
    });

    await page.foo();
  });

  test('looks for elements inside the scope', async function (assert) {
    assert.expect(1);

    const expectedSelector = '.scope span';
    let page;

    page = create({
      foo: clickable('span', { scope: '.scope' }),
    });

    await render(hbs`<div class="scope"><span>Click me</span></div>`);

    find(expectedSelector)?.addEventListener('click', () => assert.ok(1), {
      once: true,
    });

    await page.foo();
  });

  test("looks for elements inside page's scope", async function (assert) {
    assert.expect(1);

    const expectedSelector = '.scope span';
    let page;

    page = create({
      scope: '.scope',

      foo: clickable('span'),
    });

    await render(hbs`<div class="scope"><span>Click me</span></div>`);

    find(expectedSelector)!.addEventListener('click', () => assert.ok(1));

    await page.foo();
  });

  test('resets scope', async function (assert) {
    assert.expect(1);

    const expectedSelector = 'span';
    let page;

    page = create({
      scope: '.scope',
      foo: clickable('span', { resetScope: true }),
    });

    await render(hbs`<span>Click me</span>`);

    find(expectedSelector)!.addEventListener('click', () => assert.ok(1));

    await page.foo();
  });

  test('returns chainable object', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickable('span'),
    });

    await render(hbs`<span>Click me</span>`);

    const ret = page.foo();
    assert.ok(ret.foo);
    await ret;
  });

  test('finds element by index', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickable('span', { at: 3 }),
    });

    await render(
      hbs`<span></span><span></span><span>Click me</span><span></span>`
    );

    find('span:nth-of-type(4)')!.addEventListener('click', () => assert.ok(1));

    await page.foo();
  });

  test('looks for elements outside the testing container', async function (assert) {
    assert.expect(1);

    const expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: clickable('span', { testContainer: expectedContext }),
    });

    document.getElementById(
      'alternate-ember-testing'
    )!.innerHTML = `<span>Click me</span>`;

    document
      .querySelector('#alternate-ember-testing span')!
      .addEventListener('click', () => assert.ok(1));

    await page.foo();
  });

  test('looks for elements within test container specified at node level', async function (assert) {
    assert.expect(1);

    const expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      testContainer: expectedContext,
      foo: clickable('span'),
    });

    document.getElementById(
      'alternate-ember-testing'
    )!.innerHTML = `<span>Click me</span>`;

    document
      .querySelector('#alternate-ember-testing span')!
      .addEventListener('click', () => assert.ok(1));

    await page.foo();
  });

  test("raises an error when the element doesn't exist", async function (assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          baz: {
            qux: clickable('button'),
          },
        },
      },
    });

    await render(hbs``);

    await assert.throws(
      function () {
        return page.foo.bar.baz.qux();
      },
      /page\.foo\.bar\.baz\.qux/,
      'Element not found'
    );
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickable('span'),
    });

    await render(hbs`<span style="display:none">Click me</span>`);

    find('span')!.addEventListener('click', () => assert.ok(1));

    await page.foo();
  });

  test('raises an error when the element is not visible and `visible` is true', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickable('span', { visible: true }),
    });

    await render(hbs`<span style="display:none">Click me</span>`);

    await assert.throws(
      function () {
        return page.foo();
      },
      /page\.foo/,
      'Element not found'
    );
  });
});
