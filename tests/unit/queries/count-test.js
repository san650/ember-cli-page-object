import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, count } from '../../page-object';

moduleFor('Unit | Property | .count');

test('returns the number of elements that match the selector', function(assert) {
  fixture(`
    <span></span>
    <span></span>
  `);

  let page = create({
    foo: count('span')
  });

  assert.equal(page.foo, 2);
});

test('returns 0 when the no element is matched', function(assert) {
  let page = create({
    foo: count('span')
  });

  assert.equal(page.foo, 0);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><span></span></div>
    <div class="scope"><span></span><span></span></div>
  `);

  let page = create({
    foo: count('span', { scope: '.scope' })
  });

  assert.equal(page.foo, 2);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><span></span></div>
    <div class="scope"><span></span><span></span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: count('span')
  });

  assert.equal(page.foo, 2);
});

test('resets scope', function(assert) {
  fixture(`
    <div class="scope"></div>
    <div><span></span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: count('span', { resetScope: true })
  });

  assert.equal(page.foo, 1);
});

test('resets multiple value', function(assert) {
  fixture(`
    <div><span></span></div>
    <div class="scope"><span></span><span></span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: count('span', { multiple: false })
  });

  assert.equal(page.foo, 2);
});
