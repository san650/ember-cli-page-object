import { test } from 'qunit';
import { moduleFor } from '../test-helper';
import { create, fillable, selectable } from '../../page-object';

moduleFor('fillable');

test('calls Ember\'s fillIn helper', function(assert) {
  assert.expect(2);

  let expectedSelector = 'span',
      expectedText = 'dummy text',
      page;


  window.fillIn = function(actualSelector, actualText) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(actualText, expectedText);
  };

  page = create({
    foo: fillable(expectedSelector)
  });

  page.foo(expectedText);
});

test('looks for elements inside the scope', function(assert) {
  assert.expect(1);

  let page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    foo: fillable('span', { scope: '.scope' })
  });

  page.foo('dummy text');
});

test('looks for elements inside page\'s scope', function(assert) {
  assert.expect(1);

  let page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    scope: '.scope',

    foo: fillable('span')
  });

  page.foo('dummy text');
});

test('resets scope', function(assert) {
  assert.expect(1);

  let page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, 'span');
  };

  page = create({
    scope: '.scope',
    foo: fillable('span', { resetScope: true })
  });

  page.foo('dummy text');
});

test('returns target object', function(assert) {
  assert.expect(1);

  let page;

  window.fillIn = function() { };

  page = create({
    foo: fillable()
  });

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert) {
  assert.expect(1);

  let expectedSelector = 'span:eq(3)',
      page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: fillable('span', { at: 3 })
  });

  page.foo();
});

test('is aliased to selectable', function(assert) {
  assert.expect(2);

  let expectedSelector = 'span',
      expectedText = 'dummy text',
      page;


  window.fillIn = function(actualSelector, actualText) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(actualText, expectedText);
  };

  page = create({
    foo: selectable(expectedSelector)
  });

  page.foo(expectedText);
});
