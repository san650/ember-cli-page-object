import { setupTestModuleForProperty } from '../../../helpers/properties';
import { create, value } from 'ember-cli-page-object';

setupTestModuleForProperty('value', function(test) {
  test('returns the text of the input', async function(assert) {
    let page = create({
      foo: value('input')
    });

    await this.adapter.createTemplate(this, page, '<input value="Lorem ipsum">');

    assert.equal(page.foo, 'Lorem ipsum');
  });

  test('returns the html of the contenteditable', async function(assert) {
    let page = create({
      foo: value('[contenteditable]')
    });

    await this.adapter.createTemplate(this, page, '<div contenteditable="true"><b>Lorem ipsum</b></div>');

    assert.equal(page.foo, '<b>Lorem ipsum</b>');
  });

  test('returns empty when the element doesn\'t have value attribute and is not contenteditable', async function(assert) {
    let page = create({
      foo: value('input')
    });

    await this.adapter.createTemplate(this, page, '<input>');

    assert.equal(page.foo, '');
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: value('input')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: value('input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: value('input')
    });

    await this.adapter.createTemplate(this, page, `
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: value('input', { at: 0, resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'lorem');
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: value('input')
    });

    await this.adapter.createTemplate(this, page, `
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: value('input', { at: 1 })
    });

    await this.adapter.createTemplate(this, page, `
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('looks for elements within test container specified at the property', async function(assert) {
    let page = create({
      foo: value('input', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<input value="lorem">', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem');
  });

  test('looks for elements within test container specified at the node', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: value('input')
    });

    await this.adapter.createTemplate(this, page, '<input value="lorem">', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem');
  });
});
