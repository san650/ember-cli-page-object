import { test } from 'qunit';
import { moduleFor, buildProperty } from '../test-helper';
import { create, clickable } from '../../page-object';

moduleFor('.clickable');

test('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, 'span');
  };

  page = create({
    foo: clickable('span')
  });

  page.foo;
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

  page.foo;
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

  page.foo;
});

test('returns target object', function(assert) {
  assert.expect(1);

  let page;

  window.click = function() {
  };

  page = create({
    foo: clickable()
  });

  assert.equal(page.foo, page);
});
