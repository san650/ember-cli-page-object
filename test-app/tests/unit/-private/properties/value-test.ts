import { create, value } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('value', function (hooks) {
  setupRenderingTest(hooks);

  test('returns the text of the input', async function (this: TestContext, assert) {
    const page = create({
      foo: value('input'),
    });

    await this.createTemplate('<input value="Lorem ipsum">');

    assert.equal(page.foo, 'Lorem ipsum');
  });

  test('returns the html of the contenteditable', async function (this: TestContext, assert) {
    const page = create({
      foo: value('[contenteditable]'),
    });

    await this.createTemplate(
      '<div contenteditable="true"><b>Lorem ipsum</b></div>'
    );

    assert.equal(page.foo, '<b>Lorem ipsum</b>');
  });

  test("returns empty when the element doesn't have value attribute and is not contenteditable", async function (this: TestContext, assert) {
    const page = create({
      foo: value('input'),
    });

    await this.createTemplate('<input>');

    assert.equal(page.foo, '');
  });

  test("raises an error when the element doesn't exist", async function (this: TestContext, assert) {
    const page = create({
      foo: {
        bar: {
          baz: {
            qux: value('input'),
          },
        },
      },
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function (this: TestContext, assert) {
    const page = create({
      foo: value('input', { scope: '.scope' }),
    });

    await this.createTemplate(`
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test("looks for elements inside page's scope", async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: value('input'),
    });

    await this.createTemplate(`
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('resets scope', async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: value('input', { at: 0, resetScope: true }),
    });

    await this.createTemplate(`
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'lorem');
  });

  test('throws error if selector matches more than one element', async function (this: TestContext, assert) {
    const page = create({
      foo: value('input'),
    });

    await this.createTemplate(`
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.throws(
      () => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./
    );
  });

  test('finds element by index', async function (this: TestContext, assert) {
    const page = create({
      foo: value('input', { at: 1 }),
    });

    await this.createTemplate(`
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('looks for elements within test container specified at the property', async function (this: TestContext, assert) {
    const page = create({
      foo: value('input', { testContainer: '#alternate-ember-testing' }),
    });

    await this.createTemplate('<input value="lorem">', {
      useAlternateContainer: true,
    });

    assert.equal(page.foo, 'lorem');
  });

  test('looks for elements within test container specified at the node', async function (this: TestContext, assert) {
    const page = create({
      testContainer: '#alternate-ember-testing',
      foo: value('input'),
    });

    await this.createTemplate('<input value="lorem">', {
      useAlternateContainer: true,
    });

    assert.equal(page.foo, 'lorem');
  });

  module('jquery compatibility', function () {
    module('input', function (hooks) {
      test('no value', async function (this: TestContext, assert) {
        const page = create({
          value: value('input'),
        });

        await render(hbs`<input />`);

        assert.strictEqual(page.value, '');
      });

      test('with value', async function (this: TestContext, assert) {
        const page = create({
          value: value('input'),
        });

        this.set('value', 'lorem');
        await render(hbs`<input value={{this.value}} />`);

        assert.strictEqual(page.value, 'lorem');

        this.set('value', null);

        assert.strictEqual(page.value, '');
      });

      test('disabled', async function (this: TestContext, assert) {
        const page = create({
          value: value('input'),
        });

        this.set('value', 'lorem');
        await render(hbs`<input value={{this.value}} disabled />`);

        assert.strictEqual(page.value, 'lorem');
      });
    });

    module('checkbox', function () {
      test('no value', async function (this: TestContext, assert) {
        const page = create({
          value: value('input'),
        });

        await render(hbs`<input type="checkbox" checked={{this.checked}} />`);

        assert.strictEqual(page.value, 'on');

        this.set('checked', '');

        assert.strictEqual(page.value, 'on');
      });

      test('with value', async function (this: TestContext, assert) {
        const page = create({
          value: value('input'),
        });

        this.set('value', 'lorem');
        await render(
          hbs`<input type="checkbox" value={{this.value}} checked={{this.checked}} />`
        );

        assert.strictEqual(page.value, 'lorem');

        this.set('value', null);

        assert.strictEqual(page.value, '');

        this.set('checked', '');

        assert.strictEqual(page.value, '');
      });

      test('disabled', async function (this: TestContext, assert) {
        const page = create({
          value: value('input'),
        });

        this.set('value', 'lorem');
        await render(
          hbs`<input type="checkbox" value={{this.value}} checked={{this.checked}} disabled />`
        );

        assert.strictEqual(page.value, 'lorem');

        this.set('checked', '');

        assert.strictEqual(page.value, 'lorem');
      });
    });

    module('select', function () {
      test('selected with [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('select'),
        });

        await this.createTemplate(`<select>
            <option value="1">lorem</option>
            <option selected value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.strictEqual(page.value, '2');
      });

      test('[disabled] selected option', async function (this: TestContext, assert) {
        const page = create({
          value: value('select'),
        });

        await this.createTemplate(`<select disabled>
            <option value="1">lorem</option>
            <option selected value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.strictEqual(page.value, '2');
      });

      test('selected option[disabled] ', async function (this: TestContext, assert) {
        const page = create({
          value: value('select'),
        });

        await this.createTemplate(`<select>
            <option value="1">lorem</option>
            <option selected value="2" disabled>Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.strictEqual(page.value, null);
      });

      test('no selected with [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('select'),
        });

        await this.createTemplate(`<select>
            <option value="1">lorem</option>
            <option value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.strictEqual(page.value, '1');
      });

      test('selected with no [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('select'),
        });

        await this.createTemplate(`<select>
            <option>lorem</option>
            <option selected>Ipsum</option>
            <option>dolor</option>
          </select>`);

        assert.strictEqual(page.value, 'Ipsum');
      });

      test('not selected with no [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('select'),
        });

        await this.createTemplate(`<select>
            <option>lorem</option>
            <option>Ipsum</option>
            <option>dolor</option>
          </select>`);

        assert.strictEqual(page.value, 'lorem');
      });

      module('optgroup', function () {
        test('selected with [value]', async function (this: TestContext, assert) {
          const page = create({
            value: value('select'),
          });

          await this.createTemplate(`<select>
            <optgroup label="optgroup 1">
              <option value="1">lorem</option>
              <option selected value="2">Ipsum</option>
              <option value="3">dolor</option>
            </optgroup>
          </select>`);

          assert.strictEqual(page.value, '2');
        });

        test('[disabled] selected with [value]', async function (this: TestContext, assert) {
          const page = create({
            value: value('select'),
          });

          await this.createTemplate(`<select>
            <optgroup label="optgroup 1" disabled>
              <option value="1">lorem</option>
              <option selected value="2">Ipsum</option>
              <option value="3">dolor</option>
            </optgroup>
          </select>`);

          assert.strictEqual(page.value, null);
        });

        test('selected with [value][disabled]', async function (this: TestContext, assert) {
          const page = create({
            value: value('select'),
          });

          await this.createTemplate(`<select>
            <optgroup label="optgroup 1">
              <option value="1">lorem</option>
              <option selected value="2" disabled>Ipsum</option>
              <option value="3">dolor</option>
            </optgroup>
          </select>`);

          assert.strictEqual(page.value, null);
        });
      });
    });

    module('select[multiple]', function () {
      test('selected with [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value<string[]>('select'),
        });

        await this.createTemplate(`<select multiple>
            <option value="1">lorem</option>
            <option selected value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.deepEqual(page.value, ['2']);
      });

      test('[disabled] selected option', async function (this: TestContext, assert) {
        const page = create({
          value: value<string[]>('select'),
        });

        await this.createTemplate(`<select multiple disabled>
            <option value="1">lorem</option>
            <option selected value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.deepEqual(page.value, ['2']);
      });

      test('selected option[disabled] ', async function (this: TestContext, assert) {
        const page = create({
          value: value<string[]>('select'),
        });

        await this.createTemplate(`<select multiple>
            <option value="1">lorem</option>
            <option selected value="2" disabled>Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.deepEqual(page.value, [] as string[]);
      });

      test('no selected with [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value<string[]>('select'),
        });

        await this.createTemplate(`<select multiple>
            <option value="1">lorem</option>
            <option value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.deepEqual(page.value, [] as string[]);
      });

      test('selected with no [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value<string[]>('select'),
        });

        await this.createTemplate(`<select multiple>
            <option>lorem</option>
            <option selected>Ipsum</option>
            <option>dolor</option>
          </select>`);

        assert.deepEqual(page.value, ['Ipsum']);
      });

      test('not selected with no [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value<string[]>('select'),
        });

        await this.createTemplate(`<select multiple>
            <option>lorem</option>
            <option>Ipsum</option>
            <option>dolor</option>
          </select>`);

        assert.deepEqual(page.value, [] as string[]);
      });

      module('optgroup', function () {
        test('selected with [value]', async function (this: TestContext, assert) {
          const page = create({
            value: value('select'),
          });

          await this.createTemplate(`<select>
            <optgroup label="optgroup 1">
              <option value="1">lorem</option>
              <option selected value="2">Ipsum</option>
              <option value="3">dolor</option>
            </optgroup>
          </select>`);

          assert.strictEqual(page.value, '2');
        });

        test('[disabled] selected with [value]', async function (this: TestContext, assert) {
          const page = create({
            value: value('select'),
          });

          await this.createTemplate(`<select>
            <optgroup label="optgroup 1" disabled>
              <option value="1">lorem</option>
              <option selected value="2">Ipsum</option>
              <option value="3">dolor</option>
            </optgroup>
          </select>`);

          assert.strictEqual(page.value, null);
        });

        test('selected with [value][disabled]', async function (this: TestContext, assert) {
          const page = create({
            value: value('select'),
          });

          await this.createTemplate(`<select>
            <optgroup label="optgroup 1">
              <option value="1">lorem</option>
              <option selected value="2" disabled>Ipsum</option>
              <option value="3">dolor</option>
            </optgroup>
          </select>`);

          assert.strictEqual(page.value, null);
        });
      });
    });

    module('option', function () {
      test('selected', async function (this: TestContext, assert) {
        const page = create({
          value: value('option[selected]'),
        });

        await this.createTemplate(`<select>
            <option value="1">lorem</option>
            <option selected value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.strictEqual(page.value, '2');
      });

      test('not selected with [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('option[value=1]'),
        });

        await this.createTemplate(`<select>
            <option value="1">lorem</option>
            <option selected value="2">Ipsum</option>
            <option value="3">dolor</option>
          </select>`);

        assert.strictEqual(page.value, '1');
      });

      test('selected with no [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('#secondOption'),
        });

        await this.createTemplate(`<select>
            <option id="firstOption">lorem</option>
            <option id="secondOption" selected>Ipsum</option>
            <option id="thirdOption">dolor</option>
          </select>`);

        assert.strictEqual(page.value, 'Ipsum');
      });

      test('not selected with no [value]', async function (this: TestContext, assert) {
        const page = create({
          value: value('#secondOption'),
        });

        await this.createTemplate(`<select>
            <option id="firstOption">lorem</option>
            <option id="secondOption">Ipsum</option>
            <option id="thirdOption">dolor</option>
          </select>`);

        assert.strictEqual(page.value, 'Ipsum');
      });
    });
  });
});
