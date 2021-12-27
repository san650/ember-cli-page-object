import { create, property } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';

module('property', function(hooks) {
  setupRenderingTest(hooks);

  test('returns property value', async function(this: TestContext, assert) {
    let page = create({
      foo: property('checked', ':input')
    });

    await this.createTemplate('<input type="checkbox" checked>');

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function(this: TestContext, assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input')
          }
        }
      }
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(this: TestContext, assert) {
    let page = create({
      foo: property('checked', ':input', { scope: '.scope' })
    });

    await this.createTemplate(`
      <div><input></div>
      <div class="scope"><input type="checkbox" checked></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: property('checked', ':input')
    });

    await this.createTemplate(`
      <div><input></div>
      <div class="scope"><input type="checkbox" checked /></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: property('checked', ':input', { resetScope: true })
    });

    await this.createTemplate(`
      <div class="scope"></div>
      <div><input type="checkbox" checked /></div>
    `);

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function(this: TestContext, assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input')
          }
        }
      }
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('throws error if selector matches more than one element', async function(this: TestContext, assert) {
    let page = create({
      foo: property('checked', ':input')
    });

    await this.createTemplate(`
      <input type="checkbox" checked>
      <input type="checkbox" checked>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('finds element by index', async function(this: TestContext, assert) {
    let page = create({
      foo: property('checked', ':input', { at: 1 })
    });

    await this.createTemplate(`
      <input>
      <input type="checkbox" checked>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', async function(this: TestContext, assert) {
    let page = create({
      foo: property('checked', ':input', { testContainer: '#alternate-ember-testing' })
    });

    await this.createTemplate('<input type="checkbox" checked>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', async function(this: TestContext, assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: property('checked', ':input')
    });

    await this.createTemplate('<input type="checkbox" checked>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });
});
