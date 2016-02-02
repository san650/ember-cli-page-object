import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import isVisible from '../../page-object/properties/is-visible';

moduleFor('propertys', 'isVisible');

test('returns true when the element is visible', function(assert) {
  fixture('<div class="element" />');

  var property = buildProperty(isVisible('.element'));

  assert.ok(property.invoke());
});

test('returns false when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  var property = buildProperty(isVisible('.element'));

  assert.ok(!property.invoke());
});

test('throws an error when the element doesn\'t exist in the DOM', function(assert) {
  assert.expect(1);

  var property = buildProperty(isVisible('.element'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('throws an error when more than one element in the DOM match', function(assert) {
  assert.expect(1);
  fixture('<div class="element"/> <div class="element"/>');

  let property = buildProperty(isVisible('.element'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'More than one element found');
  }
});

test("doesn't throw error if matches more than one element but multiple: true option was used", function(assert) {
  fixture('<div class="element"/> <div class="element" style="display:none" />');

  let property = buildProperty(isVisible('.element', { multiple: true }));

  assert.ok(property.invoke());
});

test('uses scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  var property = buildProperty(isVisible('.element:first', { scope: '.scope' }));

  assert.ok(property.invoke());
});

test('uses parent scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  var property = buildProperty(isVisible('.element:first'), { scope: '.scope' });

  assert.ok(property.invoke());
});
