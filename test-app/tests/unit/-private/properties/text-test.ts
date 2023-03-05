import { create, text } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';

module('text', function(hooks) {
  setupRenderingTest(hooks);

  test('returns the inner text of the element', async function(this: TestContext, assert) {
    let page = create({
      foo: text('span')
    });

    await this.createTemplate('Hello <span>world!</span>');

    assert.equal(page.foo, 'world!');
  });

  test('removes white spaces from the beginning and end of the text', async function(this: TestContext, assert) {

    let page = create({
      foo: text('span')
    });

    await this.createTemplate('<span>  awesome!  </span>');

    assert.equal(page.foo, 'awesome!');
  });

  test('normalizes inner text of the element containing newlines', async function(this: TestContext, assert) {
    let page = create({
      foo: text('span')
    });

    await this.createTemplate(['<span>', 'Hello', 'multi-line', 'world!', '</span>'].join('\n'));

    assert.equal(page.foo, 'Hello multi-line world!');
  });

  test('avoid text normalization if normalize:false', async function(this: TestContext, assert) {
    let denormalizedText = [' \n ', 'Hello', 'multi-line', 'world! ', '\t', '\n'].join('\n');

    let page = create({
      foo: text('span', { normalize: false })
    });

    await this.createTemplate(`<span>${denormalizedText}</span>`);

    assert.equal(page.foo, denormalizedText);
  });

  test('converts &nbsp; characters into standard whitespace characters', async function(this: TestContext, assert) {
    let page = create({
      foo: text('span')
    });

    await this.createTemplate('<span>This&nbsp;is&nbsp;awesome.</span>');

    assert.equal(page.foo, 'This is awesome.');
  });

  test("returns empty text when the element doesn't have text", async function(this: TestContext, assert) {
    let page = create({
      foo: text('span')
    });

    await this.createTemplate('<span />');

    assert.equal(page.foo, '');
  });

  test("raises an error when the element doesn't exist", async function(this: TestContext, assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: text('span')
          }
        }
      }
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(this: TestContext, assert) {
    let page = create({
      foo: text('span', { scope: '.scope' })
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test("looks for elements inside page's scope", async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: text('span')
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('resets scope', async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: text('span', { at: 0, resetScope: true })
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span> ipsum </span></div>
      <div><span>dolor</span></div>
    `);

    assert.equal(page.foo, 'lorem');
  });

  test('finds element by index', async function(this: TestContext, assert) {
    let page = create({
      foo: text('span', { at: 1 })
    });

    await this.createTemplate(`
      <span>lorem</span>
      <span>ipsum</span>
      <span>dolor</span>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('finds element without using a selector', async function(this: TestContext, assert) {
    let page = create({
      scope: 'p',

      foo: text(),

      bar: {
        scope: 'span',

        baz: text()
      }
    });

    await this.createTemplate('<p>Hello <span>world!</span></p>');

    assert.equal(page.foo, 'Hello world!');
    assert.equal(page.bar.baz, 'world!');
  });

  test('throws error if selector matches more than one element', async function(this: TestContext, assert) {
    let page = create({
      foo: text('span')
    });

    await this.createTemplate(`
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('looks for elements outside the testing container', async function(this: TestContext, assert) {
    let page = create({
      foo: text('h1', { testContainer: '#alternate-ember-testing' })
    });

    await this.createTemplate('<h1>lorem ipsum</h1>', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem ipsum');
  });

  test('looks for elements within test container specified at node level', async function(this: TestContext, assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: text('h1')
    });

    await this.createTemplate('<h1>lorem ipsum</h1>', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem ipsum');
  });
});
