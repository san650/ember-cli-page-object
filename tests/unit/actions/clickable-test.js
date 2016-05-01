import { test } from 'qunit';
import { moduleFor, fixture } from '../test-helper';
import { create, clickable } from '../../page-object';

moduleFor('Unit | Property | .clickable');

test('calls Ember\'s click helper', function(assert) {
  fixture('<span>Click me</span>');
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
  fixture('<div class="scope"><span>Click me</span></div>');
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
  fixture('<div class="scope"><span>Click me</span></div>');
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
  fixture('<span>Click me</span>');
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
  fixture('<span>Click me</span>');
  assert.expect(1);

  let page;

  window.click = function() {};

  page = create({
    foo: clickable('span')
  });

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert) {
  fixture('<span></span><span></span><span>Click me</span><span></span>');
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

test('looks for elements outside the testing container', function(assert) {
  fixture('<span>Click me</span>', { useAlternateContainer: true });
  assert.expect(1);

  let expectedContext = '#alternate-ember-testing',
      page;

  window.click = function(_, actualContext) {
    assert.equal(actualContext, expectedContext);
  };

  page = create({
    foo: clickable('span', { testContainer: expectedContext })
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
          qux: clickable('button')
        }
      }
    }
  });

  page.foo.bar.baz.qux().then().catch(error => {
    assert.ok(/page\.foo\.bar\.baz\.qux/.test(error.toString()), 'Element not found');
  }).finally(done);
});

test("doesn't raise an error when the element is not visible and `visible` is not set", function(assert) {
  fixture('<span style="display:none">Click me</span>');
  assert.expect(1);

  window.click = function() {
    assert.ok(true, 'Element is clicked');
  };

  let page = create({
    foo: clickable('span')
  });

  page.foo();
});

test('raises an error when the element is not visible and `visible` is true', function(assert) {
  fixture('<span style="display:none">Click me</span>');
  assert.expect(1);

  let done = assert.async();
  let page = create({
    foo: clickable('span', { visible: true })
  });

  page.foo().then().catch(error => {
    assert.ok(/page\.foo/.test(error.toString()), 'Element not found');
  }).finally(done);
});
