import { moduleForProperty } from '../../../helpers/properties';
import { create, attribute } from 'ember-cli-page-object';

moduleForProperty('attribute', function(test) {
  test('returns attribute value', async function(assert) {
    let page = create({
      foo: attribute('placeholder', ':input')
    });

    await this.adapter.createTemplate(this, page, '<input placeholder="a value">');

    assert.equal(page.foo, 'a value');
  });

  test("returns null when attribute doesn't exist", async function(assert) {
    let page = create({
      foo: attribute('placeholder', ':input')
    });

    await this.adapter.createTemplate(this, page, '<input>');

    assert.equal(page.foo, null);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: attribute('placeholder', ':input')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: attribute('placeholder', ':input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input placeholder="a value"></div>
      <div><input></div>
    `);

    assert.equal(page.foo, 'a value');
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: attribute('placeholder', ':input')
    });

    await this.adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input placeholder="a value"></div>
      <div><input></div>
    `);

    assert.equal(page.foo, 'a value');
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: attribute('placeholder', ':input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <div class="scope"></div>
      <div><input placeholder="a value"></div>
    `);

    assert.equal(page.foo, 'a value');
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: attribute('placeholder', ':input')
    });

    await this.adapter.createTemplate(this, page, `
      <input placeholder="a value">
      <input placeholder="other value">
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: attribute('placeholder', ':input', { at: 1 })
    });

    await this.adapter.createTemplate(this, page, `
      <input>
      <input placeholder="a value">
    `);

    assert.equal(page.foo, 'a value');
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: attribute('placeholder', ':input', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<input placeholder="a value">', { useAlternateContainer: true });

    assert.equal(page.foo, 'a value');
  });

  test('normalizes value', async function(assert) {
    let page = create({
      foo: attribute('disabled', 'span'),
      nonExisting: attribute('non-existing', 'span')
    });

    await this.adapter.createTemplate(this, page, '<span disabled>');

    assert.equal(page.foo, 'disabled');
    assert.strictEqual(page.nonExisting, undefined);
  });
});
