import { test } from 'qunit';
import { moduleFor, fixture } from '../test-helper';
import { create, focusable } from '../../page-object';

moduleFor('Unit | Propery | .focusable');

test('calls Ember\'s triggerEvent helper with proper args', function(assert) {
  fixture('<span></span>');
  assert.expect(2);

  let expectedSelector = 'span',
      page;

  window.triggerEvent = function(actualSelector, _, event) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(event, "focus");
  };

  page = create({
    foo: focusable(expectedSelector)
  });

  page.foo();
});

test('looks for elements inside the scope', function(assert) {
  fixture('<div class="scope"><span></span></div>');
  assert.expect(1);

  let page;

  window.triggerEvent = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    foo: focusable('span', { scope: '.scope' })
  });

  page.foo();
});

test('looks for elements inside page\'s scope', function(assert) {
  fixture('<div class="scope"><span></span></div>');
  assert.expect(1);

  let page;

  window.triggerEvent = function(actualSelector) {
    assert.equal(actualSelector, '.scope span');
  };

  page = create({
    scope: '.scope',

    foo: focusable('span')
  });

  page.foo();
});

test('resets scope', function(assert) {
  fixture('<span></span>');
  assert.expect(1);

  let page;

  window.triggerEvent = function(actualSelector) {
    assert.equal(actualSelector, 'span');
  };

  page = create({
    scope: '.scope',
    foo: focusable('span', { resetScope: true })
  });

  page.foo();
});

test('returns target object', function(assert) {
  fixture('<span></span>');
  assert.expect(1);

  let page;

  window.triggerEvent = function() {};

  page = create({
    foo: focusable('span')
  });

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert) {
  fixture('<span></span><span></span><span></span><span></span>');
  assert.expect(1);

  let expectedSelector = 'span:eq(3)',
      page;

  window.triggerEvent = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: focusable('span', { at: 3 })
  });

  page.foo();
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<span></span>', { useAlternateContainer: true });
  assert.expect(1);

  let expectedContext = '#alternate-ember-testing',
      page;

  window.triggerEvent = function(_, actualContext) {
    assert.equal(actualContext, expectedContext);
  };

  page = create({
    foo: focusable('span', { testContainer: expectedContext })
  });

  page.foo();
});

test("raises an error when the element doesn't exist", function(assert) {
  assert.expect(1);

  var done = assert.async();

  let page = create({
    foo: {
      bar: {
        baz: {
          qux: focusable('button')
        }
      }
    }
  });

  page.foo.bar.baz.qux().then().catch(error => {
    assert.ok(/page\.foo\.bar\.baz\.qux/.test(error.toString()), 'Element not found');
  }).finally(done);
});
