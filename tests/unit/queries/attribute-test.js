import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, attribute } from '../../page-object';

moduleFor('.attribute');

test('returns attribute value', function(assert) {
  fixture('<input placeholder="a value">');

  let page = create({
    foo: attribute('placeholder', ':input')
  });

  assert.equal(page.foo, 'a value');
});

test("returns null when attribute doesn't exist", function(assert) {
  fixture('<input>');

  let page = create({
    foo: attribute('placeholder', ':input')
  });

  assert.equal(page.foo, null);
});

test("raises an error when the element doesn't exist", function(assert) {
  let page = create({
    foo: attribute('placeholder', ':input')
  });

  assert.throws(() => page.foo, 'Throws element not found error');
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><input></div>
    <div class="scope"><input placeholder="a value"></div>
    <div><input></div>
  `);

  let page = create({
    foo: attribute('placeholder', ':input', { scope: '.scope' })
  });

  assert.equal(page.foo, 'a value');
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><input></div>
    <div class="scope"><input placeholder="a value"></div>
    <div><input></div>
  `);

  let page = create({
    scope: '.scope',

    foo: attribute('placeholder', ':input')
  });

  assert.equal(page.foo, 'a value');
});

test('resets scope', function(assert) {
  fixture(`
    <div class="scope"></div>
    <div><input placeholder="a value"></div>
  `);

  let page = create({
    scope: '.scope',

    foo: attribute('placeholder', ':input', { resetScope: true })
  });

  assert.equal(page.foo, 'a value');
});

test('finds element by index', function(assert) {
  fixture(`
    <input>
    <input placeholder="a value">
  `);

  let page = create({
    foo: attribute('placeholder', ':input', { at: 1 })
  });

  assert.equal(page.foo, 'a value');
});
