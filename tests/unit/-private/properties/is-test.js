import { moduleForProperty } from '../../../helpers/properties';
import { create, is } from 'ember-cli-page-object';

moduleForProperty('is', function(test) {
  test('returns is value', async function(assert) {
    let page = create({
      foo: is(':checked', ':input')
    });

    await this.adapter.createTemplate(this, page, '<input type="checkbox" checked>');

    assert.equal(page.foo, true);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        checked: is(':checked', ':input')
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.checked, /page\.foo\.checked/);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: is(':checked', ':input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input type="checkbox" checked></div>
      <div><input></div>
    `);

    assert.equal(page.foo, true);
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: is(':checked', ':input')
    });

    await this.adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input type="checkbox" checked></div>
      <div><input></div>
    `);

    assert.equal(page.foo, true);
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: is(':checked', ':input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <div class="scope"></div>
      <div><input type="checkbox" checked></div>
    `);

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: is(':checked', ':input')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: is(':checked', ':input')
    });

    await this.adapter.createTemplate(this, page, `
      <input type="checkbox" checked>
      <input type="checkbox" checked>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements', async function(assert) {
    let page = create({
      foo: is(':checked', 'input.foo', { multiple: true }),
      bar: is(':checked', 'input.bar', { multiple: true })
    });

    await this.adapter.createTemplate(this, page, `
      <input class="foo" type="checkbox" checked>
      <input class="foo" type="checkbox" checked="checked">
      <input class="foo" type="checkbox" checked=true>
      <input class="bar" type="checkbox" checked>
      <input class="bar" type="checkbox">
    `);

    assert.equal(page.foo, true);
    assert.equal(page.bar, false);
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: is(':checked', ':input', { at: 1 })
    });

    await this.adapter.createTemplate(this, page, `
      <input>
      <input type="checkbox" checked>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: is('.foo', 'h1', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<h1 class="foo">lorem ipsum</h1>', { useAlternateContainer: true });

    assert.equal(page.foo, true);
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: is('.foo', 'h1')
    });

    await this.adapter.createTemplate(this, page, '<h1 class="foo">lorem ipsum</h1>', { useAlternateContainer: true });

    assert.equal(page.foo, true);
  });
});
