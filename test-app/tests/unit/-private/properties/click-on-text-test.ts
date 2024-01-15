import { setupRenderingTest } from '../../../helpers';
import { create, clickOnText } from 'ember-cli-page-object';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('clickOnText', function (hooks) {
  setupRenderingTest(hooks);

  test('calls click helper', async function (assert) {
    assert.expect(2);

    const page = create({
      foo: clickOnText('fieldset'),
      bar: clickOnText('button'),
    });

    await render(hbs`
      <fieldset>
        <button id="first">Lorem</button>
        <button id="last">Ipsum</button>
      </fieldset>
    `);

    find('#first')!.addEventListener('click', () => {
      assert.ok(true);
    });

    find('#last')!.addEventListener('click', () => {
      assert.ok(false);
    });

    await page.foo('Lorem');

    await page.bar('Lorem');
  });

  test('looks for elements inside the scope', async function (assert) {
    assert.expect(2);

    const page = create({
      foo: clickOnText('fieldset', { scope: '.scope' }),
      bar: clickOnText('button', { scope: '.scope' }),
    });

    await render(hbs`
      <div class="scope">
        <fieldset>
          <button id="first">Lorem</button>
          <button id="last">Ipsum</button>
        </fieldset>
      </div>
    `);

    find('#first')!.addEventListener('click', () => {
      assert.ok(true);
    });

    find('#last')!.addEventListener('click', () => {
      assert.ok(false);
    });

    await page.foo('Lorem');

    await page.bar('Lorem');
  });

  test("looks for elements inside page's scope", async function (assert) {
    assert.expect(2);

    const page = create({
      scope: '.scope',
      foo: clickOnText('fieldset'),
      bar: clickOnText('button'),
    });

    await render(hbs`
      <div class="scope">
        <fieldset>
          <button id="first">Lorem</button>
          <button id="last">Ipsum</button>
        </fieldset>
      </div>
    `);

    find('#first')!.addEventListener('click', () => {
      assert.ok(true);
    });

    find('#last')!.addEventListener('click', () => {
      assert.ok(false);
    });

    await page.foo('Lorem');

    await page.bar('Lorem');
  });

  test('resets scope', async function (assert) {
    assert.expect(2);

    const page = create({
      scope: '.scope',
      foo: clickOnText('fieldset', { resetScope: true }),
      bar: clickOnText('button', { resetScope: true }),
    });

    await render(hbs`
      <fieldset>
        <button id="first">Lorem</button>
        <button id="last">Ipsum</button>
      </fieldset>
    `);

    find('#first')!.addEventListener('click', () => {
      assert.ok(true);
    });

    find('#last')!.addEventListener('click', () => {
      assert.ok(false);
    });

    await page.foo('Lorem');

    await page.bar('Lorem');
  });

  test('returns chainable object', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickOnText(),
    });

    await render(hbs`<button>dummy text</button>`);

    const ret = page.foo('dummy text');
    assert.ok(ret.foo);
    await ret;
  });

  test('finds element by index', async function (assert) {
    assert.expect(2);

    const page = create({
      foo: clickOnText('fieldset', { at: 2 }),
      bar: clickOnText('button', { at: 2 }),
    });

    await render(hbs`
      <fieldset>
        <button class="other">Lorem</button>
        <button class="other">Lorem</button>
        <button id="target">Lorem</button>
        <button class="other">Ipsum</button>
      </fieldset>
    `);

    find('#target')!.addEventListener('click', () => {
      assert.ok(true);
    });

    findAll('.other')!.forEach((otherElement) => {
      otherElement.addEventListener('click', () => {
        assert.ok(false);
      });
    });

    await page.foo('Lorem');

    await page.bar('Lorem');
  });

  test('looks for elements outside the testing container', async function (assert) {
    assert.expect(1);

    const expectedContext = '#alternate-ember-testing';

    const page = create({
      foo: clickOnText('button', { testContainer: expectedContext }),
    });

    document.getElementById(
      'alternate-ember-testing'
    )!.innerHTML = `<button type="button">Lorem</button>`;

    document
      .querySelector('#alternate-ember-testing button')!
      .addEventListener('click', () => assert.ok(1));

    await page.foo('Lorem');
  });

  test('looks for elements within test container specified at node level', async function (assert) {
    assert.expect(1);

    const expectedContext = '#alternate-ember-testing';
    const page = create({
      testContainer: expectedContext,
      foo: clickOnText('button'),
    });

    document.getElementById(
      'alternate-ember-testing'
    )!.innerHTML = `<button type="button">Lorem</button>`;

    await render(hbs`<button type="button">Lorem</button>`);

    document
      .querySelector('#alternate-ember-testing button')!
      .addEventListener('click', () => assert.ok(1));

    await page.foo('Lorem');
  });

  test("raises an error when the element doesn't exist", async function (assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          baz: {
            qux: clickOnText('button'),
          },
        },
      },
    });

    await render(hbs``);

    assert.throws(
      () => {
        return page.foo.bar.baz.qux('Lorem');
      },
      /page\.foo\.bar\.baz\.qux/,
      'Element not found'
    );
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickOnText('button'),
    });

    await render(
      hbs`<button type="button" style="display:none">Click me</button>`
    );

    find('button')!.addEventListener('click', () => assert.ok(1));

    await page.foo('Click me');
  });

  test('raises an error when the element is not visible and `visible` is true', async function (assert) {
    assert.expect(1);

    const page = create({
      foo: clickOnText('button', { visible: true }),
    });

    await render(
      hbs`<button type="button" style="display:none">Click me</button>`
    );

    await assert.throws(
      () => page.foo('Click me'),
      /page\.foo/,
      'Element not found'
    );
  });
});
