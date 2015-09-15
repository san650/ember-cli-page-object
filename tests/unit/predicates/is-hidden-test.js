import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import isHidden from '../../page-object/properties/is-hidden';

moduleFor('propertys', 'isHidden');

test('returns true when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  var property = buildProperty(isHidden('.element'));

  assert.ok(property.invoke());
});

test('returns true when the element doesn\'t exist in the DOM', function(assert) {
  var property = buildProperty(isHidden('.element'));

  assert.ok(property.invoke());
});

test('returns false when the element is visible', function(assert) {
  fixture('<div class="element" />');

  var property = buildProperty(isHidden('.element'));

  assert.ok(!property.invoke());
});

test('uses scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  var property = buildProperty(isHidden('.element:first', { scope: '.scope' }));

  assert.ok(property.invoke());
});

test('uses parent scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  var property = buildProperty(isHidden('.element:first'), { scope: '.scope' });

  assert.ok(property.invoke());
});
