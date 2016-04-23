import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, value } from '../../page-object';
import {
  test_throws_if_not_multiple
} from '../shared';

moduleFor('Unit | Property | .value');

test('returns the text of the input', function(assert) {
  fixture('<input value="Lorem ipsum">');

  let page = create({
    foo: value('input')
  });

  assert.equal(page.foo, 'Lorem ipsum');
});

test('returns empty when the element doesn\'t have value attribute', function(assert) {
  fixture('<input>');

  let page = create({
    foo: value('input')
  });

  assert.equal(page.foo, '');
});

test("raises an error when the element doesn't exist", function(assert) {
  let page = create({
    foo: value('input')
  });

  assert.throws(() => page.foo, 'Throws element not found error');
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><input value="lorem"></div>
    <div class="scope"><input value="ipsum"></div>
  `);

  let page = create({
    foo: value('input', { scope: '.scope' })
  });

  assert.equal(page.foo, 'ipsum');
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><input value="lorem"></div>
    <div class="scope"><input value="ipsum"></div>
  `);

  let page = create({
    scope: '.scope',

    foo: value('input')
  });

  assert.equal(page.foo, 'ipsum');
});

test('resets scope', function(assert) {
  fixture(`
    <div><input value="lorem"></div>
    <div class="scope"><input value="ipsum"></div>
  `);

  let page = create({
    scope: '.scope',

    foo: value('input', { at: 0, resetScope: true })
  });

  assert.equal(page.foo, 'lorem');
});

test_throws_if_not_multiple(function() {
  fixture(`
    <input value="lorem">
    <input value="ipsum">
  `);

  let page = create({
    foo: value('input')
  });

  return page.foo;
});

test('matches multiple elements with multiple: true option', function(assert) {
  fixture(`
    <input value="lorem">
    <input value="ipsum">
  `);

  let page = create({
    foo: value('input', { multiple: true })
  });

  assert.deepEqual(page.foo, ["lorem", "ipsum"]);
});

test('finds element by index', function(assert) {
  fixture(`
    <input value="lorem">
    <input value="ipsum">
  `);

  let page = create({
    foo: value('input', { at: 1 })
  });

  assert.equal(page.foo, 'ipsum');
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<input value="lorem">', { useAlternateContainer: true });

  var page = create({
    foo: value('input', { testContainer: '#alternate-ember-testing' })
  });

  assert.equal(page.foo, 'lorem');
});
