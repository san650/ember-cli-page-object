import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, value } from '../../page-object';

moduleFor('.value');

test('returns the text of the input', function(assert) {
  fixture('<input value="Lorem ipsum">');

  let page = create({
    foo: value('input')
  });

  assert.equal(page.foo, 'Lorem ipsum');
});

test('returns empty when the element doesn\'t have value attribute', function(assert) {
  fixture('<input>');

  let page = create({
    foo: value('input')
  });

  assert.equal(page.foo, '');
});

test("raises an error when the element doesn't exist", function(assert) {
  let page = create({
    foo: value('input')
  });

  assert.throws(() => page.foo, 'Throws element not found error');
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><input value="lorem"></div>
    <div class="scope"><input value="ipsum"></div>
  `);

  let page = create({
    foo: value('input', { scope: '.scope' })
  });

  assert.equal(page.foo, 'ipsum');
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><input value="lorem"></div>
    <div class="scope"><input value="ipsum"></div>
  `);

  let page = create({
    scope: '.scope',

    foo: value('input')
  });

  assert.equal(page.foo, 'ipsum');
});

test('resets scope', function(assert) {
  fixture(`
    <div><input value="lorem"></div>
    <div class="scope"><input value="ipsum"></div>
  `);

  let page = create({
    scope: '.scope',

    foo: value('input', { at: 0, resetScope: true })
  });

  assert.equal(page.foo, 'lorem');
});

test('throws error if selector matches more than one element', function(assert) {
  fixture(`
    <input value="lorem">
    <input value="ipsum">
  `);

  let page = create({
    foo: value('input')
  });

  assert.throws(
    () => page.foo,
    /input matched more than one element. If this is not an error use { multiple: true }/
  );
});

test('matches multiple elements with multiple: true option', function(assert) {
  fixture(`
    <input value="lorem">
    <input value="ipsum">
  `);

  let page = create({
    foo: value('input', { multiple: true })
  });

  assert.equal(page.foo, "lorem");
});

test('finds element by index', function(assert) {
  fixture(`
    <input value="lorem">
    <input value="ipsum">
  `);

  let page = create({
    foo: value('input', { at: 1 })
  });

  assert.equal(page.foo, 'ipsum');
});
