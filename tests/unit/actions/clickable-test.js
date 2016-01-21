import { test } from 'qunit';
import { moduleFor } from '../test-helper';
import { create, clickable } from '../../page-object';

moduleFor('.clickable');

test('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'span',
      page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickable(expectedSelector)
  });

  page.foo();
});

test('looks for elements inside the scope', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    foo: clickable('span', { scope: '.scope' })
  });

  page.foo();
});

test('looks for elements inside page\'s scope', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    scope: '.scope',

    foo: clickable('span')
  });

  page.foo();
});

test('resets scope', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, 'span');
  };

  page = create({
    scope: '.scope',
    foo: clickable('span', { resetScope: true })
  });

  page.foo();
});

test('returns target object', function(assert) {
  assert.expect(1);

  let page;

  window.click = function() {};

  page = create({
    foo: clickable()
  });

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert) {
  assert.expect(1);

  let expectedSelector = 'span:eq(3)',
      page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickable('span', { at: 3 })
  });

  page.foo();
});
