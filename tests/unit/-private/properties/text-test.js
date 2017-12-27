import { moduleForProperty } from '../../../helpers/properties';
import { create, text } from 'ember-cli-page-object';

moduleForProperty('text', function(test) {
  test('returns the inner text of the element', async function(assert) {
    let page = create({
      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, 'Hello <span>world!</span>');

    assert.equal(page.foo, 'world!');
  });

  test('removes white spaces from the beginning and end of the text', async function(assert) {

    let page = create({
      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, '<span>  awesome!  </span>');

    assert.equal(page.foo, 'awesome!');
  });

  test('normalizes inner text of the element containing newlines', async function(assert) {
    let page = create({
      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, ['<span>', 'Hello', 'multi-line', 'world!', '</span>'].join('\n'));

    assert.equal(page.foo, 'Hello multi-line world!');
  });

  test('avoid text normalization if normalize:false', async function(assert) {
    let denormalizedText = [' \n ', 'Hello', 'multi-line', 'world! ', '\t', '\n'].join('\n');

    let page = create({
      foo: text('span', { normalize: false })
    });

    await this.adapter.createTemplate(this, page, `<span>${denormalizedText}</span>`);

    assert.equal(page.foo, denormalizedText);
  });

  test('converts &nbsp; characters into standard whitespace characters', async function(assert) {
    let page = create({
      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, '<span>This&nbsp;is&nbsp;awesome.</span>');

    assert.equal(page.foo, 'This is awesome.');
  });

  test("returns empty text when the element doesn't have text", async function(assert) {
    let page = create({
      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, '<span />');

    assert.equal(page.foo, '');
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: text('span')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: text('span', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: text('span', { at: 0, resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span> ipsum </span></div>
      <div><span>dolor</span></div>
    `);

    assert.equal(page.foo, 'lorem');
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: text('span', { at: 1 })
    });

    await this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span>ipsum</span>
      <span>dolor</span>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('finds element without using a selector', async function(assert) {
    let page = create({
      scope: 'p',

      foo: text(),

      bar: {
        scope: 'span',

        baz: text()
      }
    });

    await this.adapter.createTemplate(this, page, '<p>Hello <span>world!</span></p>');

    assert.equal(page.foo, 'Hello world!');
    assert.equal(page.bar.baz, 'world!');
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: text('span')
    });

    await this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('returns multiple values', async function(assert) {
    let page = create({
      foo: text('li', { multiple: true })
    });

    await this.adapter.createTemplate(this, page, `
      <ul>
        <li>lorem</li>
        <li> ipsum </li>
        <li>dolor</li>
      </ul>
    `);

    assert.deepEqual(page.foo, ['lorem', 'ipsum', 'dolor']);
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: text('h1', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<h1>lorem ipsum</h1>', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem ipsum');
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: text('h1')
    });

    await this.adapter.createTemplate(this, page, '<h1>lorem ipsum</h1>', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem ipsum');
  });
});
