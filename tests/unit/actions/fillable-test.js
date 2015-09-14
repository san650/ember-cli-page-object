import { module, test } from 'qunit';
import { buildProperty } from '../test-helper';
import fillable from '../../page-object/properties/fillable';

module('Actions | fillable');

test('calls Ember\'s fillIn helper', function(assert) {
  assert.expect(2);

  let expectedSelector = '.element',
      expectedText = 'dummy text',
      property;


  window.fillIn = function(actualSelector, actualText) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(actualText, expectedText);
  };

  property = buildProperty(fillable(expectedSelector));

  property.invoke(expectedText);
});

test('uses scope', function(assert) {
  assert.expect(1);

  let property;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  property = buildProperty(fillable('.element', { scope: '.scope' }));

  property.invoke('dummy text');
});

test('uses parent scope', function(assert) {
  assert.expect(1);

  let property;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.parent-scope .element');
  };

  property = buildProperty(fillable('.element'), { scope: '.parent-scope' });

  property.invoke('dummy text');
});

test('returns target object', function(assert) {
  assert.expect(1);

  let target = { dummy: "value" },
      property;

  window.fillIn = function() {
  };

  property = buildProperty(fillable(), target);

  assert.equal(property.invoke('dummy text'), target);
});
