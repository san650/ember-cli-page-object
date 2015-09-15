import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import value from '../../page-object/properties/value';

moduleFor('Queries', 'value');

test('returns the text of the input', function(assert) {
  fixture('<input value="Hello world" />');

  let property = buildProperty(value('input'));

  assert.equal(property.invoke(), 'Hello world');
});

test('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  let property = buildProperty(value('span'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('returns empty when the element doesn\'t have value attribute', function(assert) {
  fixture('<span />');

  let property = buildProperty(value('span'));

  assert.equal(property.invoke(), '');
});

test('uses scope', function(assert) {
  fixture('<div class="scope"><input value="Hello" /></div><input value="world!" />');

  var property = buildProperty(value('input', { scope: '.scope' }));

  assert.equal(property.invoke(), 'Hello');
});

test('uses page scope', function(assert) {
  fixture('<div class="scope"><input value="Hello" /></div><input value="world!" />');

  var property = buildProperty(value('input'), { scope: '.scope' });

  assert.equal(property.invoke(), 'Hello');
});
