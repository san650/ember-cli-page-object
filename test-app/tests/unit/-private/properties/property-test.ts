import { create, property } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';

module('property', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (this: TestContext, assert) {
    const page = create({
      scope: 'input',
      foo: property('checked'),
    });

    await this.createTemplate('<input type="checkbox" checked>');

    assert.ok(page.foo);
  });

  test('returns property value', async function (this: TestContext, assert) {
    const page = create({
      foo: property('checked', ':input'),
    });

    await this.createTemplate('<input type="checkbox" checked>');

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function (this: TestContext, assert) {
    const page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input'),
          },
        },
      },
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function (this: TestContext, assert) {
    const page = create({
      foo: property('checked', ':input', { scope: '.scope' }),
    });

    await this.createTemplate(`
      <div><input></div>
      <div class="scope"><input type="checkbox" checked></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: property('checked', ':input'),
    });

    await this.createTemplate(`
      <div><input></div>
      <div class="scope"><input type="checkbox" checked /></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: property('checked', ':input', { resetScope: true }),
    });

    await this.createTemplate(`
      <div class="scope"></div>
      <div><input type="checkbox" checked /></div>
    `);

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function (this: TestContext, assert) {
    const page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input'),
          },
        },
      },
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('throws error if selector matches more than one element', async function (this: TestContext, assert) {
    const page = create({
      foo: property('checked', ':input'),
    });

    await this.createTemplate(`
      <input type="checkbox" checked>
      <input type="checkbox" checked>
    `);

    assert.throws(
      () => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./
    );
  });

  test('finds element by index', async function (this: TestContext, assert) {
    const page = create({
      foo: property('checked', ':input', { at: 1 }),
    });

    await this.createTemplate(`
      <input>
      <input type="checkbox" checked>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', async function (this: TestContext, assert) {
    const page = create({
      foo: property('checked', ':input', {
        testContainer: '#alternate-ember-testing',
      }),
    });

    await this.createTemplate('<input type="checkbox" checked>', {
      useAlternateContainer: true,
    });

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', async function (this: TestContext, assert) {
    const page = create({
      testContainer: '#alternate-ember-testing',
      foo: property('checked', ':input'),
    });

    await this.createTemplate('<input type="checkbox" checked>', {
      useAlternateContainer: true,
    });

    assert.ok(page.foo);
  });

  module('jquery compatibility', function () {
    test('readonly', async function (this: TestContext, assert) {
      const page = create({
        scope: 'input',
        lowercase: property('readonly'),
        camelCase: property('readOnly'),
      });

      await this.createTemplate('<input type="checkbox" readonly>');

      assert.true(page.lowercase, 'lowercase');
      assert.true(page.camelCase, 'camelCase');
    });

    test('not readonly', async function (this: TestContext, assert) {
      const page = create({
        scope: 'input',
        lowecase: property('readonly'),
        camelCase: property('readOnly'),
      });

      await this.createTemplate('<input type="checkbox">');

      assert.false(page.lowecase, 'lowercase');
      assert.false(page.camelCase, 'camelCase');
    });

    test('maxlength', async function (this: TestContext, assert) {
      const page = create({
        scope: 'input',
        lowercase: property('maxlength'),
        camelCase: property('maxLength'),
      });

      await this.createTemplate('<input type="checkbox" maxlength="1">');

      assert.strictEqual(page.lowercase, 1, 'lowercase');
      assert.strictEqual(page.camelCase, 1, 'camelCase');
    });

    test('no maxlength', async function (this: TestContext, assert) {
      const page = create({
        scope: 'input',
        lowercase: property('maxlength'),
        camelCase: property('maxLength'),
      });

      await this.createTemplate('<input type="checkbox">');

      assert.strictEqual(page.lowercase, -1, 'lowercase');
      assert.strictEqual(page.camelCase, -1, 'camelCase');
    });

    test('contenteditable', async function (this: TestContext, assert) {
      const page = create({
        scope: 'span',
        lowercase: property('contenteditable'),
        camelCase: property('contentEditable'),
      });

      await this.createTemplate('<span contenteditable>');

      assert.strictEqual(page.lowercase, 'true', 'lowercase');
      assert.strictEqual(page.camelCase, 'true', 'camelCase');
    });

    test('not contenteditable', async function (this: TestContext, assert) {
      const page = create({
        scope: 'span',
        lowercase: property('contenteditable'),
        camelCase: property('contentEditable'),
      });

      await this.createTemplate('<span>');

      assert.strictEqual(page.lowercase, 'inherit', 'lowercase');
      assert.strictEqual(page.camelCase, 'inherit', 'camelCase');
    });

    test('non-standard', async function (this: TestContext, assert) {
      const page = create({
        scope: 'span',
        lowercase: property('neverexisted'),
        camelCase: property('neverExisted'),
        dasherized: property('never-existed'),
      });

      await this.createTemplate('<span neverexisted="true">');

      assert.strictEqual(page.lowercase, undefined, 'lowercase');
      assert.strictEqual(page.camelCase, undefined, 'camelCase');
      assert.strictEqual(page.dasherized, undefined, 'dash-erized');
    });

    test('[data-*]', async function (this: TestContext, assert) {
      const page = create({
        scope: 'span',
        lowercase: property('data-test'),
        camelCase: property('neverTest'),
        dasherized: property('never-test'),
      });

      await this.createTemplate('<span date-test="true">');

      assert.strictEqual(page.lowercase, undefined, 'lowercase');
      assert.strictEqual(page.camelCase, undefined, 'camelCase');
      assert.strictEqual(page.dasherized, undefined, 'dash-erized');
    });

    module('tabindex', function () {
      test('camelCase', async function (this: TestContext, assert) {
        const page = create({
          foo: property('tabIndex', 'input'),
        });

        await this.createTemplate('<input type="checkbox" tabindex="2">');

        assert.strictEqual(page.foo, 2);
      });

      test('explicitly specified', async function (this: TestContext, assert) {
        const page = create({
          foo: property('tabindex', 'input'),
        });

        await this.createTemplate('<input type="checkbox" tabindex="2">');

        assert.strictEqual(page.foo, 2);
      });

      test('unspecified on interactive', async function (this: TestContext, assert) {
        const page = create({
          foo: property('tabindex', 'input'),
        });

        await this.createTemplate('<input type="checkbox">');

        assert.strictEqual(page.foo, 0);
      });

      test('unspecified on non-interactive', async function (this: TestContext, assert) {
        const page = create({
          foo: property('tabindex', 'span'),
        });

        await this.createTemplate('<span></span>');

        assert.strictEqual(page.foo, -1);
      });

      test('uspecified on an interactive link(with href)', async function (this: TestContext, assert) {
        const page = create({
          foo: property('tabindex', 'a'),
        });

        await this.createTemplate('<a href="javascript:;"></a>');

        assert.strictEqual(page.foo, 0);
      });
    });
  });
});
