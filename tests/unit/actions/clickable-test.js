import { module, test } from 'qunit';
import { buildProperty } from '../test-helper';
import clickable from '../../page-object/properties/clickable';

module('Actions | clickable');

test('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'button',
      property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  property = buildProperty(clickable(expectedSelector));

  property.invoke();
});

test('uses scope', function(assert) {
  assert.expect(1);

  let property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  property = buildProperty(clickable('.element', { scope: '.scope' }));

  property.invoke();
});

test('uses parent scope', function(assert) {
  assert.expect(1);

  let property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.parent-scope .element');
  };

  property = buildProperty(clickable('.element'), { scope: '.parent-scope' });

  property.invoke();
});

test('returns target object', function(assert) {
  assert.expect(1);

  let target = { dummy: "value" },
      property;

  window.click = function() {
  };

  property = buildProperty(clickable(), target);

  assert.equal(property.invoke(), target);
});
