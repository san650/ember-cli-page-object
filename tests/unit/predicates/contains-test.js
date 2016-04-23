import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, contains } from '../../page-object';
import {
  test_throws_if_not_multiple
} from '../shared';

moduleFor('Unit | Property | .contains');

test('returns true when the element contains the text', function(assert) {
  fixture('Lorem <span>ipsum</span>');

  let page = create({
    foo: contains('span')
  });

  assert.ok(!page.foo('Not here'));
  assert.ok(page.foo('ipsum'));
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  let page = create({
    foo: contains('span', { scope: '.scope' })
  });

  assert.ok(!page.foo('lorem'));
  assert.ok(page.foo('ipsum'));
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: contains('span')
  });

  assert.ok(!page.foo('lorem'));
  assert.ok(page.foo('ipsum'));
});

test('raises an error when the element doesn\'t exist', function(assert) {
  let page = create({
    foo: contains('.element')
  });

  assert.throws(() => page.foo('baz'), 'Throws element not found error');
});

test('resets scope', function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: contains('span', { at: 0, resetScope: true })
  });

  assert.ok(page.foo('lorem'));
});

test_throws_if_not_multiple(function() {
  fixture(`
    <span>lorem</span>
    <span> ipsum </span>
    <span>dolor</span>
  `);

  let page = create({
    foo: contains('span')
  });

  page.foo('lorem');
});

test('matches multiple elements with multiple: true option, returns false if not all elements contain text', function(assert) {
  fixture(`
    <span>lorem</span>
    <span>ipsum</span>
    <span>dolor</span>
  `);

  let page = create({
    foo: contains('span', { multiple: true })
  });

  assert.ok(!page.foo('lorem'));
});

test('matches multiple elements with multiple: true option, returns true if all elements contain text', function(assert) {
  fixture(`
    <span>lorem</span>
    <span>lorem</span>
  `);

  let page = create({
    foo: contains('span', { multiple: true })
  });

  assert.ok(page.foo('lorem'));
});

test('finds element by index', function(assert) {
  fixture(`
    <span>lorem</span>
    <span>ipsum</span>
    <span>dolor</span>
  `);

  let page = create({
    foo: contains('span', { at: 1 })
  });

  assert.ok(!page.foo('lorem'));
  assert.ok(page.foo('ipsum'));
});

test('looks for elements outside the testing container', function(assert) {
  fixture('Lorem <span>ipsum</span>', { useAlternateContainer: true });

  let page = create({
    foo: contains('span', { testContainer: '#alternate-ember-testing' })
  });

  assert.ok(page.foo('ipsum'));
});
