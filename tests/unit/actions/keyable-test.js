import { test } from 'qunit';
import { moduleFor, fixture } from '../test-helper';
import { create, keyable } from '../../page-object';

moduleFor('Unit | Property | .keyable');

test('calls Ember\'s keyEvent helper with proper args', function(assert) {
  fixture('<span></span>');
  assert.expect(3);

  let expectedSelector = 'span';
  let page;

  window.keyEvent = function(actualSelector, _, event, keyCode) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(event, 'keypress');
    assert.equal(keyCode, 13);
  };

  page = create({
    foo: keyable('keypress', 13, expectedSelector)
  });

  page.foo();
});

test('looks for elements inside the scope', function(assert) {
  fixture('<div class="scope"><span></span></div>');
  assert.expect(1);

  let page;

  window.keyEvent = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    foo: keyable('keypress', 13, 'span', { scope: '.scope' })
  });

  page.foo();
});

test('looks for elements inside page\'s scope', function(assert) {
  fixture('<div class="scope"><span></span></div>');
  assert.expect(1);

  let page;

  window.keyEvent = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    scope: '.scope',

    foo: keyable('keypress', 13, 'span')
  });

  page.foo();
});

test('resets scope', function(assert) {
  fixture('<span></span>');
  assert.expect(1);

  let page;

  window.keyEvent = function(actualSelector) {
    assert.equal(actualSelector, 'span');
  };

  page = create({
    scope: '.scope',
    foo: keyable('keypress', 13, 'span', { resetScope: true })
  });

  page.foo();
});

test('returns target object', function(assert) {
  fixture('<span></span>');
  assert.expect(1);

  let page;

  window.keyEvent = function() {};

  page = create({
    foo: keyable('keypress', 13, 'span')
  });

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert) {
  fixture('<span></span><span></span><span></span><span></span>');
  assert.expect(1);

  let expectedSelector = 'span:eq(3)';
  let page;

  window.keyEvent = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: keyable('keypress', 13, 'span', { at: 3 })
  });

  page.foo();
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<span></span>', { useAlternateContainer: true });
  assert.expect(1);

  let expectedContext = '#alternate-ember-testing';
  let page;

  window.keyEvent = function(_, actualContext) {
    assert.equal(actualContext, expectedContext);
  };

  page = create({
    foo: keyable('keypress', 13, 'span', { testContainer: expectedContext })
  });

  page.foo();
});

test("raises an error when the element doesn't exist", function(assert) {
  assert.expect(1);

  let done = assert.async();

  let page = create({
    foo: {
      bar: {
        baz: {
          qux: keyable('keypress', 'button', 13)
        }
      }
    }
  });

  page.foo.bar.baz.qux().then().catch((error) => {
    assert.ok(/page\.foo\.bar\.baz\.qux/.test(error.toString()), 'Element not found');
  }).finally(done);
});
