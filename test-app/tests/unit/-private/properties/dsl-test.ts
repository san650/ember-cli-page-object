import { create, collection } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';

module('dsl', function (hooks) {
  setupRenderingTest(hooks);

  test('generates .isVisible', async function (this: TestContext, assert) {
    let page = create({
      scope: 'span',
      foo: {},
    });

    await this.createTemplate('Lorem <span>ipsum</span>');

    assert.ok(page.isVisible, 'page is visible');
    assert.ok(page.foo.isVisible, 'component is visible');
  });

  test('generates .isHidden', async function (this: TestContext, assert) {
    let page = create({
      scope: 'span',
      foo: {},
    });

    await this.createTemplate('Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.isHidden, 'page is hidden');
    assert.ok(page.foo.isHidden, 'component is hidden');
  });

  test('generates .isPresent', async function (this: TestContext, assert) {
    let page = create({
      scope: 'span',
      foo: {},
    });

    await this.createTemplate('Lorem <span>ipsum</span>');

    assert.ok(page.isPresent, 'page is rendered in DOM');
    assert.ok(page.foo.isPresent, 'component is rendered in DOM');
  });

  [
    'blur',
    'click',
    'clickOn',
    'contains',
    'fillIn',
    'focus',
    'isHidden',
    'isPresent',
    'isVisible',
    'select',
    'text',
    'value',
  ].forEach((prop) => {
    test(`does not override .${prop}`, async function (this: TestContext, assert) {
      let page = create({
        get [prop]() {
          return 'foo bar';
        },
      });

      await this.createTemplate('');

      assert.equal(page[prop], 'foo bar');
    });
  });

  test('generates .blur', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button',
      },
    });

    await this.createTemplate('<button>dummy text</button>');

    const button = find('button') as HTMLElement;
    button.focus();
    button.addEventListener('blur', () => assert.ok(1));

    await page.foo.blur();
  });

  test('generates .clickOn', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {},
    });

    await this.createTemplate('<button>dummy text</button>');

    // text nodes don't support click events
    // instead we check that click on text content propagates to the parent button
    find('button')?.addEventListener('click', () => assert.ok(1));

    await page.foo.clickOn('dummy text');
  });

  test('generates .click', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button',
      },
    });

    await this.createTemplate('<button>dummy text</button>');

    (find('button') as HTMLElement).addEventListener('click', () => assert.ok(1));

    await page.foo.click();
  });

  test('generates .contains', async function (this: TestContext, assert) {
    let page = create({
      foo: {
        scope: 'span',
      },
    });

    await this.createTemplate('Ipsum <span>Dolor</span>');

    assert.ok(page.foo.contains('or'), 'contains');
  });

  test('generates .text', async function (this: TestContext, assert) {
    let page = create({
      scope: '.scope',
      foo: {
        scope: 'span',
      },
    });

    await this.createTemplate(`
      <div>Lorem</div>
      <div class="scope">Ipsum <span>Dolor</span></div>
    `);

    assert.equal(page.text, 'Ipsum Dolor');
    assert.equal(page.foo.text, 'Dolor');
  });

  test('generates .fillIn', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input',
      },
    });

    await this.createTemplate('<input name="email">');

    await page.foo.fillIn('lorem ipsum');

    assert.equal((find('input') as HTMLInputElement).value, 'lorem ipsum');
  });

  test('generates .focus', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button',
      },
    });

    await this.createTemplate('<button>dummy text</button>');

    (find('button') as HTMLElement).addEventListener('focus', () => assert.ok(1));

    await page.foo.focus();
  });

  test('generates .select', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input',
      },
    });

    await this.createTemplate('<input name="email">');

    // @ts-expect-error no types exposed.
    // @todo: deprecate and remove the select
    await page.foo.select('lorem ipsum');

    assert.equal((find('input') as HTMLInputElement).value, 'lorem ipsum');
  });

  test('generates .value', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input',
      },
    });

    await this.createTemplate('<input value="lorem ipsum">');

    assert.equal(page.foo.value, 'lorem ipsum');
  });

  test('generates .then', async function (this: TestContext, assert) {
    let page = create({
      foo: {},
    });

    await this.createTemplate('');

    assert.ok(typeof page.then === 'function');
    assert.ok(typeof page.foo.then === 'function');
  });

  test('generates .as', async function (this: TestContext, assert) {
    assert.expect(2);

    let page = create({
      scope: 'span',
      foo: {
        get baz() {
          return 'foobar';
        },
      },
    });

    await this.createTemplate('Lorem <span>ipsum</span>');

    // @ts-expect-error no types exposed.
    // @todo: deprecate and remove the `as()`
    let foo = page.foo.as((element) => {
      assert.equal(element.text, 'ipsum');
    });

    assert.equal(foo.baz, 'foobar');
  });

  test('generates .as when nested', async function (this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      scope: 'span',
      foo: {
        bar: {
          scope: 'strong',
        },
      },
    });

    await this.createTemplate(
      'Lorem <span>ipsum <strong>dolor</strong></span>'
    );

    // @ts-expect-error no types exposed.
    // @todo: deprecate and remove the `as()`
    page.foo.bar.as((element) => {
      assert.equal(element.text, 'dolor');
    });
  });

  test('generates .as in collections', async function (this: TestContext, assert) {
    assert.expect(2);

    let page = create({
      items: collection('ul li'),
    });

    await this.createTemplate(`
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>
    `);

    // @ts-expect-error no types exposed.
    // @todo: deprecate and remove the `as()`
    page.items[0].as((item) => {
      assert.equal(item.text, 'foo');
    });

    // @ts-expect-error no types exposed.
    // @todo: deprecate and remove the `as()`
    page.items[1].as((item) => {
      assert.equal(item.text, 'bar');
    });
  });
});
