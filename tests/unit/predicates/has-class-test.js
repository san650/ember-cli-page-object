import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import hasClass from '../../page-object/properties/has-class';

moduleFor('Actions', 'hasClass');

test('returns true when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  let property = buildProperty(hasClass('has-error', '.element'));

  assert.ok(property.invoke());
});

test('returns false when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  let property = buildProperty(hasClass('has-error', '.element'));

  assert.ok(!property.invoke());
});

test('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  let property = buildProperty(hasClass('has-error', '.element'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('uses scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  let property = buildProperty(hasClass('has-error', '.element:first', { scope: '.scope' }));

  assert.ok(property.invoke());
});

test('uses parent scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  var property = buildProperty(hasClass('has-error', '.element:first'), { scope: '.scope' });

  assert.ok(property.invoke());
});
