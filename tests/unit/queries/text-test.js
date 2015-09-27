import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import text from '../../page-object/properties/text';

moduleFor('Queries', 'text');

test('returns the inner text of the element', function(assert) {
  fixture('Hello <span>world!</span>');

  let property = buildProperty(text('span'));

  assert.equal(property.invoke(), 'world!');
});

test('removes white spaces from the beginning and end of the text', function(assert) {
  fixture('<span>  awesome!  </span>');

  let property = buildProperty(text('span'));

  assert.equal(property.invoke(), 'awesome!');
});

test('normalizes inner text of the element containing newlines', function(assert) {
  fixture(['<span>', 'Hello', 'multi-line', 'world!', '</span>'].join("\n"));

  let property = buildProperty(text('span'));

  assert.equal(property.invoke(), 'Hello multi-line world!');
});

test('converts &nbsp; characters into standard whitespace characters', function(assert) {
  fixture('<span>This&nbsp;is&nbsp;awesome.</span>');

  let property = buildProperty(text('span'));

  assert.equal(property.invoke(), 'This is awesome.');
});

test('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  let property = buildProperty(text('span'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('returns empty when the element doesn\'t have text', function(assert) {
  fixture('<span />');

  let property = buildProperty(text('span'));

  assert.equal(property.invoke(), '');
});

test('uses scope', function(assert) {
  fixture('<div class="scope"><span>Hello</span></div><span> world!</span>');

  var property = buildProperty(text('span', { scope: '.scope' }));

  assert.equal(property.invoke(), 'Hello');
});

test('uses page scope', function(assert) {
  fixture('<div class="scope"><span>Hello</span></div><span> world!</span>');

  var property = buildProperty(text('span'), { scope: '.scope' });

  assert.equal(property.invoke(), 'Hello');
});
