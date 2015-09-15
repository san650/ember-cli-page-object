import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import notHasClass from '../../page-object/properties/not-has-class';

moduleFor('propertys', 'notHasClass');

test('returns false when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  var property = buildProperty(notHasClass('has-error', '.element'));

  assert.ok(!property.invoke());
});

test('returns true when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  var property = buildProperty(notHasClass('has-error', '.element'));

  assert.ok(property.invoke());
});

test('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  var property = buildProperty(notHasClass('has-error', '.element'));

  try {
    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('uses scope', function(assert) {
  fixture('<div class="element scope has-error"><div class="element" /></div>');

  var property = buildProperty(notHasClass('has-error', '.element:first', { scope: '.scope' }));

  assert.ok(property.invoke());
});

test('uses parent scope', function(assert) {
  fixture('<div class="element scope has-error"><div class="element" /></div>');

  var property = buildProperty(notHasClass('has-error', '.element:first'), { scope: '.scope' });

  assert.ok(property.invoke());
});
