import { test } from 'qunit';
import { buildProperty, moduleFor, fixture } from './test-helper';
import customHelper from '../page-object/properties/custom-helper';
import text from '../page-object/properties/text';

moduleFor('Helpers', 'customHelper');

test('accepts a selector', function(assert) {
  assert.expect(1);

  let expectedSelector = '.selector';

  let helper = customHelper(function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  });

  let property = buildProperty(helper(expectedSelector));

  property.invoke();
});

test('accepts an options hash', function(assert) {
  assert.expect(2);

  let helper = customHelper(function(selector, options) {
    assert.equal(options.dummy, 'value');
    assert.equal(options.another, 'dummy value');
  });

  let property = buildProperty(helper('.selector', { dummy: 'value', another: 'dummy value' }));

  property.invoke();
});

test('uses scope', function(assert) {
  assert.expect(1);

  let helper = customHelper(function(selector) {
    assert.equal(selector, '.scope .selector');
  });

  let property = buildProperty(helper('.selector', { scope: '.scope' }));

  property.invoke();
});

test('uses page scope', function(assert) {
  assert.expect(1);

  let helper = customHelper(function(selector) {
    assert.equal(selector, '.scope .selector');
  });

  let property = buildProperty(helper('.selector'), { scope: '.scope' });

  property.invoke();
});

test('returns simple values', function(assert) {
  let helper = customHelper(function() {
    return 'dummy string';
  });

  let property = buildProperty(helper());

  assert.equal(property.invoke(), 'dummy string');
});

test('returns components', function(assert) {
  fixture('<strong>Wrong</strong><span class="scope"><strong>Right</strong></span>');

  let helper = customHelper(function() {
    return {
      scope: '.scope',
      text: text('strong')
    };
  });

  let property = buildProperty(helper());

  assert.equal(property.invoke().text(), 'Right');
});

test('returns functions', function(assert) {
  let helper = customHelper(function() {
    return function() {
      return 'dummy string';
    };
  });

  let property = buildProperty(helper());

  assert.equal(property.invoke(), 'dummy string');
});

test('pass function invocation params to inner function', function(assert) {
  assert.expect(2);

  let helper = customHelper(function() {
    return function(param1, param2) {
      assert.equal(param1, 'lorem');
      assert.equal(param2, 'ipsum');
    };
  });

  let property = buildProperty(helper());

  property.invoke('lorem', 'ipsum');
});
