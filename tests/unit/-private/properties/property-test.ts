import { moduleForProperty } from '../../../helpers/properties';
import { create, property } from 'ember-cli-page-object';

moduleForProperty('property', function(test) {
  test('returns property value', async function(assert) {
    let page = create({
      foo: property('checked', ':input')
    });

    await this.adapter.createTemplate(this, page, '<input type="checkbox" checked>');

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: property('checked', ':input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input type="checkbox" checked></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: property('checked', ':input')
    });

    await this.adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input type="checkbox" checked /></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: property('checked', ':input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <div class="scope"></div>
      <div><input type="checkbox" checked /></div>
    `);

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: property('checked', ':input')
    });

    await this.adapter.createTemplate(this, page, `
      <input type="checkbox" checked>
      <input type="checkbox" checked>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: property('checked', ':input', { at: 1 })
    });

    await this.adapter.createTemplate(this, page, `
      <input>
      <input type="checkbox" checked>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: property('checked', ':input', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<input type="checkbox" checked>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: property('checked', ':input')
    });

    await this.adapter.createTemplate(this, page, '<input type="checkbox" checked>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });
});
