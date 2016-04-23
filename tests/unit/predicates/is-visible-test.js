import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, isVisible } from '../../page-object';
import {
  test_throws_if_not_multiple
} from '../shared';

moduleFor('Unit | Property | .isVisible');

test('returns true when the element is visible', function(assert) {
  fixture('Lorem <span>ipsum</span>');

  let page = create({
    foo: isVisible('span')
  });

  assert.ok(page.foo);
});

test('returns false when the element is hidden', function(assert) {
  fixture('Lorem <span style="display:none">ipsum</span>');

  let page = create({
    foo: isVisible('span')
  });

  assert.ok(!page.foo);
});

test('returns false when the element doesn\'t exist', function(assert) {
  let page = create({
    foo: isVisible('span')
  });

  assert.ok(!page.foo);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><span style="display:none">lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
  `);

  let page = create({
    foo: isVisible('span', { scope: '.scope', at: 0 })
  });

  assert.ok(page.foo);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><span style="display:none">lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: isVisible('span', { at: 0 })
  });

  assert.ok(page.foo);
});

test('resets scope', function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span style="display:none">ipsum</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: isVisible('span', { resetScope: true, at: 0 })
  });

  assert.ok(page.foo);
});

test_throws_if_not_multiple(function() {
  fixture(`
    <span>lorem</span>
    <span> ipsum </span>
    <span>dolor</span>
  `);

  let page = create({
    foo: isVisible('span')
  });

  return page.foo;
});

test('matches multiple elements with multiple: true option, return false if not all elements are visible', function(assert) {
  fixture(`
    <span>lorem</span>
    <span style="display:none"> ipsum </span>
    <span>dolor</span>
  `);

  let page = create({
    foo: isVisible('span', { multiple: true })
  });

  assert.ok(!page.foo);
});

test('matches multiple elements with multiple: true option, return true if all elements are visible', function(assert) {
  fixture(`
    <span>lorem</span>
    <span>dolor</span>
  `);

  let page = create({
    foo: isVisible('span', { multiple: true })
  });

  assert.ok(page.foo);
});

test('finds element by index', function(assert) {
  fixture(`
    <em style="display:none">lorem</em>
    <em style="display:none">ipsum</em>
    <em>dolor</em>
  `);

  let page = create({
    foo: isVisible('em', { at: 0 }),
    bar: isVisible('em', { at: 2 })
  });

  assert.ok(!page.foo);
  assert.ok(page.bar);
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<span style="display:none">ipsum</span>');
  fixture('<span>ipsum</span>', { useAlternateContainer: true });

  let page = create({
    foo: isVisible('span', { testContainer: '#alternate-ember-testing' })
  });

  assert.ok(page.foo);
});
