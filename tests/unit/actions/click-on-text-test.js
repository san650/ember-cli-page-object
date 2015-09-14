import { module, test } from 'qunit';
import { buildProperty } from '../test-helper';
import clickOnText from '../../page-object/properties/click-on-text';

module('Actions | clickOnText');

test('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'button :contains("dummy text"):last',
      property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  property = buildProperty(clickOnText('button'));

  property.invoke('dummy text');
});

test('uses scope', function(assert) {
  assert.expect(1);

  let property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element :contains("dummy text"):last');
  };

  property = buildProperty(clickOnText('.element', { scope: '.scope' }));

  property.invoke('dummy text');
});

test('uses parent scope', function(assert) {
  assert.expect(1);

  let property;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.parent-scope .element :contains("dummy text"):last');
  };

  property = buildProperty(clickOnText('.element'), { scope: '.parent-scope' });

  property.invoke('dummy text');
});

test('returns target object', function(assert) {
  assert.expect(1);

  let target = { dummy: "value" },
      property;

  window.click = function() {
  };

  property = buildProperty(clickOnText(), target);

  assert.equal(property.invoke('dummy text'), target);
});
