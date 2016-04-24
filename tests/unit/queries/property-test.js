import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, property } from '../../page-object';
import { test_throws_if_not_multiple } from '../shared';

moduleFor('Unit | Property | .property');

test('returns property value', function(assert) {
  fixture('<input type="checkbox" checked>');

  let page = create({
    foo: property('checked', ':input')
  });

  assert.ok(page.foo);
});

test("raises an error when the element doesn't exist", function(assert) {
  let page = create({
    foo: {
      bar: {
        baz: {
          qux: property('checked', ':input')
        }
      }
    }
  });

  assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><input></div>
    <div class="scope"><input checked></div>
    <div><input></div>
  `);

  let page = create({
    foo: property('checked', ':input', { scope: '.scope' })
  });

  assert.ok(page.foo);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><input></div>
    <div class="scope"><input checked></div>
    <div><input></div>
  `);

  let page = create({
    scope: '.scope',

    foo: property('checked', ':input')
  });

  assert.ok(page.foo);
});

test('resets scope', function(assert) {
  fixture(`
    <div class="scope"></div>
    <div><input checked></div>
  `);

  let page = create({
    scope: '.scope',

    foo: property('checked', ':input', { resetScope: true })
  });

  assert.ok(page.foo);
});

test_throws_if_not_multiple(function() {
  fixture(`
    <input checked>
    <input checked>
  `);

  let page = create({
    foo: property('checked', ':input')
  });

  return page.foo;
});

test('matches multiple elements', function(assert) {
  fixture(`
    <input input="checkbox" checked>
    <input input="checkbox" >
  `);

  let page = create({
    foo: property('checked', ':input', { multiple: true })
  });

  assert.deepEqual(page.foo, [true, false]);
});

test('finds element by index', function(assert) {
  fixture(`
    <input>
    <input checked>
  `);

  let page = create({
    foo: property('checked', ':input', { at: 1 })
  });

  assert.ok(page.foo);
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<input checked>', { useAlternateContainer: true });

  var page = create({
    foo: property('checked', ':input', { testContainer: '#alternate-ember-testing' })
  });

  assert.ok(page.foo);
});
