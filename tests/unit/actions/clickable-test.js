import { module, test, finish } from '../../helpers/unit';
import { create, clickable } from 'ember-cli-page-object';

module('Unit | Property | .clickable');

test('calls click helper', function(assert, adapter) {
  assert.expect(1);

  let expectedSelector = 'button';
  let page;

  page = create({
    foo: clickable(expectedSelector)
  });

  adapter.createTemplate(this, page, '<button>Click me</button>');

  adapter.click((actualSelector) => {
    assert.equal(actualSelector, expectedSelector);
  });

  page.foo();
});

test('looks for elements inside the scope', function(assert, adapter) {
  assert.expect(1);

  let expectedSelector = '.scope span';
  let page;

  page = create({
    foo: clickable('span', { scope: '.scope' })
  });

  adapter.createTemplate(this, page, '<div class="scope"><span>Click me</span></div>');

  adapter.click((actualSelector) => {
    assert.equal(actualSelector, expectedSelector);
  });

  page.foo();
});

test("looks for elements inside page's scope", function(assert, adapter) {
  assert.expect(1);

  let expectedSelector = '.scope span';
  let page;

  page = create({
    scope: '.scope',

    foo: clickable('span')
  });

  adapter.createTemplate(this, page, '<div class="scope"><span>Click me</span></div>');

  adapter.click((actualSelector) => {
    assert.equal(actualSelector, expectedSelector);
  });

  page.foo();
});

test('resets scope', function(assert, adapter) {
  assert.expect(1);

  let expectedSelector = 'span';
  let page;

  page = create({
    scope: '.scope',
    foo: clickable('span', { resetScope: true })
  });

  adapter.createTemplate(this, page, '<span>Click me</span>');

  adapter.click((actualSelector) => {
    assert.equal(actualSelector, expectedSelector);
  });

  page.foo();
});

test('returns target object', function(assert, adapter) {
  assert.expect(1);

  let page;

  page = create({
    foo: clickable('span')
  });

  adapter.createTemplate(this, page, '<span>Click me</span>');

  adapter.click(function() {});

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert, adapter) {
  assert.expect(1);

  let expectedSelector = 'span:eq(3)';
  let page;

  page = create({
    foo: clickable('span', { at: 3 })
  });

  adapter.click((actualSelector) => {
    assert.equal(actualSelector, expectedSelector);
  });

  adapter.createTemplate(this, page, '<span></span><span></span><span>Click me</span><span></span>');

  page.foo();
});

test('looks for elements outside the testing container', function(assert, adapter) {
  assert.expect(1);

  let expectedContext = '#alternate-ember-testing';
  let page;

  page = create({
    foo: clickable('span', { testContainer: expectedContext })
  });

  adapter.createTemplate(this, page, '<span>Click me</span>', { useAlternateContainer: true });

  adapter.click((_, actualContext) => {
    assert.equal(actualContext, expectedContext);
  });

  page.foo();
});

test("raises an error when the element doesn't exist", function(assert, adapter) {
  assert.expect(1);

  let page = create({
    foo: {
      bar: {
        baz: {
          qux: clickable('button')
        }
      }
    }
  });

  adapter.createTemplate(this, page);

  adapter.throws(assert, function() {
    return page.foo.bar.baz.qux();
  }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
});

test("doesn't raise an error when the element is not visible and `visible` is not set", function(assert, adapter) {
  assert.expect(1);

  let page = create({
    foo: clickable('span')
  });

  adapter.createTemplate(this, page, '<span style="display:none">Click me</span>');

  adapter.click(() => {
    assert.ok(true, 'Element is clicked');
  });

  page.foo();
});

test('raises an error when the element is not visible and `visible` is true', function(assert, adapter) {
  assert.expect(1);

  let page = create({
    foo: clickable('span', { visible: true })
  });

  adapter.createTemplate(this, page, '<span style="display:none">Click me</span>');

  adapter.throws(assert, function() {
    return page.foo();
  }, /page\.foo/, 'Element not found');
});

finish();
