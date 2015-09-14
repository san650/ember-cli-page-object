import { module, test } from 'qunit';
import clickable from '../../page-object/properties/clickable';

module('Actions | clickable');

function buildProperty(descriptor, parent = {}) {
  return descriptor.propertyFor(parent, 'key');
}

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

test('uses page scope', function(assert) {
  assert.expect(1);

  let property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  property = buildProperty(clickable('.element'), { scope: '.scope' });

  property.invoke();
});

test('returns window.click value', function(assert) {
  assert.expect(1);

  let returnValue = "A value",
      property;

  window.click = function() {
    return returnValue;
  };

  property = buildProperty(clickable());

  assert.equal(property.invoke(), returnValue);
});
