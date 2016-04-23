import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, isHidden } from '../../page-object';
import {
  test_throws_if_not_multiple
} from '../shared';

moduleFor('Unit | Property | .isHidden');

test('returns true when the element is hidden', function(assert) {
  fixture('Lorem <span style="display:none">ipsum</span>');

  let page = create({
    foo: isHidden('span')
  });

  assert.ok(page.foo);
});

test("returns true when the element doesn't exist in the DOM", function(assert) {
  let page = create({
    foo: isHidden('span')
  });

  assert.ok(page.foo);
});

test('returns false when the element is visible', function(assert) {
  fixture('Lorem <span>ipsum</span>');

  let page = create({
    foo: isHidden('span')
  });

  assert.ok(!page.foo);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span style="display:none">ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  let page = create({
    foo: isHidden('span', { scope: '.scope' })
  });

  assert.ok(page.foo);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span style="display:none">ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: isHidden('span')
  });

  assert.ok(page.foo);
});

test('resets scope', function(assert) {
  fixture(`
    <div><span style="display:none">lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
    <div><span>dolor</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: isHidden('span', { resetScope: true, at: 0 })
  });

  assert.ok(page.foo);
});

test_throws_if_not_multiple(function() {
  fixture(`
    <em style="display:none">ipsum</em>
    <em style="display:none">dolor</em>
  `);

  let page = create({
    foo: isHidden('em')
  });

  return page.foo;
});

test('matches multiple elements with multiple: true option, returns true if all elements are hidden', function(assert) {
  fixture(`
    <em style="display:none">ipsum</em>
    <em style="display:none">dolor</em>
  `);

  let page = create({
    foo: isHidden('em', { multiple: true })
  });

  assert.ok(page.foo);
});

test('matches multiple elements with multiple: true option, returns false if some elements are visible', function(assert) {
  fixture(`
    <em>ipsum</em>
    <em style="display:none">dolor</em>
  `);

  let page = create({
    foo: isHidden('em', { multiple: true })
  });

  assert.ok(!page.foo);
});

test('finds element by index', function(assert) {
  fixture(`
    <em>lorem</em>
    <em>ipsum</em>
    <em style="display:none">dolor</em>
  `);

  let page = create({
    foo: isHidden('em', { at: 2 })
  });

  assert.ok(page.foo);
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<span>ipsum</span>');
  fixture('<span style="display:none">ipsum</span>', { useAlternateContainer: true });

  let page = create({
    foo: isHidden('span', { testContainer: '#alternate-ember-testing' })
  });

  assert.ok(page.foo);
});
