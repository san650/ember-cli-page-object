import { test } from 'qunit';
import { moduleFor } from '../test-helper';
import { create, clickOnText } from '../../page-object';

moduleFor('Unit | Property | .clickOnText');

test('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'span :contains("dummy text"):last',
      page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickOnText('span')
  });

  page.foo('dummy text');
});

test('looks for elements inside the scope', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope span :contains("dummy text"):last');
  };

  page = create({
    foo: clickOnText('span', { scope: '.scope' })
  });

  page.foo('dummy text');
});

test('looks for elements inside page\'s scope', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope span :contains("dummy text"):last');
  };

  page = create({
    scope: '.scope',
    foo: clickOnText('span')
  });

  page.foo('dummy text');
});

test('resets scope', function(assert) {
  assert.expect(1);

  let page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, 'span :contains("dummy text"):last');
  };

  page = create({
    scope: '.scope',
    foo: clickOnText('span', { resetScope: true })
  });

  page.foo('dummy text');
});

test('returns target object', function(assert) {
  assert.expect(1);

  let page;

  window.click = function() {
  };

  page = create({
    dummy: 'value',

    foo: clickOnText()
  });

  assert.equal(page.foo('dummy text'), page);
});

test('finds element by index', function(assert) {
  assert.expect(1);

  let expectedSelector = 'span :contains("dummy text"):eq(3)',
      page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickOnText('span', { at: 3 })
  });

  page.foo('dummy text');
});
