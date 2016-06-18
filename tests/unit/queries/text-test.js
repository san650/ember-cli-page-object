import { module, test, finish } from '../../helpers/unit';
import { create, text } from 'ember-cli-page-object';

module('Unit | Property | .text');

test('returns the inner text of the element', function(assert, adapter) {
  let page = create({
    foo: text('span')
  });

  adapter.createTemplate(this, page, 'Hello <span>world!</span>');

  assert.equal(page.foo, 'world!');
});

test('removes white spaces from the beginning and end of the text', function(assert, adapter) {

  let page = create({
    foo: text('span')
  });

  adapter.createTemplate(this, page, '<span>  awesome!  </span>');

  assert.equal(page.foo, 'awesome!');
});

test('normalizes inner text of the element containing newlines', function(assert, adapter) {
  let page = create({
    foo: text('span')
  });

  adapter.createTemplate(this, page, ['<span>', 'Hello', 'multi-line', 'world!', '</span>'].join('\n'));

  assert.equal(page.foo, 'Hello multi-line world!');
});

test('avoid text normalization if normalize:false', function(assert, adapter) {
  let denormalizedText = [' \n ', 'Hello', 'multi-line', 'world! ', '\t', '\n'].join('\n');

  let page = create({
    foo: text('span', { normalize: false })
  });

  adapter.createTemplate(this, page, `<span>${denormalizedText}</span>`);

  assert.equal(page.foo, denormalizedText);
});

test('converts &nbsp; characters into standard whitespace characters', function(assert, adapter) {
  let page = create({
    foo: text('span')
  });

  adapter.createTemplate(this, page, '<span>This&nbsp;is&nbsp;awesome.</span>');

  assert.equal(page.foo, 'This is awesome.');
});

test("returns empty text when the element doesn't have text", function(assert, adapter) {
  let page = create({
    foo: text('span')
  });

  adapter.createTemplate(this, page, '<span />');

  assert.equal(page.foo, '');
});

test("raises an error when the element doesn't exist", function(assert, adapter) {
  let page = create({
    foo: {
      bar: {
        baz: {
          qux: text('span')
        }
      }
    }
  });

  adapter.createTemplate(this, page);

  assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
});

test('looks for elements inside the scope', function(assert, adapter) {
  let page = create({
    foo: text('span', { scope: '.scope' })
  });

  adapter.createTemplate(this, page, `
    <div><span>lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  assert.equal(page.foo, 'ipsum');
});

test("looks for elements inside page's scope", function(assert, adapter) {
  let page = create({
    scope: '.scope',

    foo: text('span')
  });

  adapter.createTemplate(this, page, `
    <div><span>lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  assert.equal(page.foo, 'ipsum');
});

test('resets scope', function(assert, adapter) {
  let page = create({
    scope: '.scope',

    foo: text('span', { at: 0, resetScope: true })
  });

  adapter.createTemplate(this, page, `
    <div><span>lorem</span></div>
    <div class="scope"><span> ipsum </span></div>
    <div><span>dolor</span></div>
  `);

  assert.equal(page.foo, 'lorem');
});

test('finds element by index', function(assert, adapter) {
  let page = create({
    foo: text('span', { at: 1 })
  });

  adapter.createTemplate(this, page, `
    <span>lorem</span>
    <span>ipsum</span>
    <span>dolor</span>
  `);

  assert.equal(page.foo, 'ipsum');
});

test('finds element without using a selector', function(assert, adapter) {
  let page = create({
    scope: 'p',

    foo: text(),

    bar: {
      scope: 'span',

      baz: text()
    }
  });

  adapter.createTemplate(this, page, '<p>Hello <span>world!</span></p>');

  assert.equal(page.foo, 'Hello world!');
  assert.equal(page.bar.baz, 'world!');
});

test('throws error if selector matches more than one element', function(assert, adapter) {
  let page = create({
    foo: text('span')
  });

  adapter.createTemplate(this, page, `
    <span>lorem</span>
    <span> ipsum </span>
    <span>dolor</span>
  `);

  assert.throws(() => page.foo,
    /matched more than one element. If this is not an error use { multiple: true }/);
});

test('returns multiple values', function(assert, adapter) {
  let page = create({
    foo: text('li', { multiple: true })
  });

  adapter.createTemplate(this, page, `
    <ul>
      <li>lorem</li>
      <li> ipsum </li>
      <li>dolor</li>
    </ul>
  `);

  assert.deepEqual(page.foo, ['lorem', 'ipsum', 'dolor']);
});

test('looks for elements outside the testing container', function(assert, adapter) {
  let page = create({
    foo: text('h1', { testContainer: '#alternate-ember-testing' })
  });

  adapter.createTemplate(this, page, '<h1>lorem ipsum</h1>', { useAlternateContainer: true });

  assert.equal(page.foo, 'lorem ipsum');
});

finish();
