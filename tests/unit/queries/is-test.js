import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, is } from '../../page-object';
import { test_throws_if_not_multiple } from '../shared';

moduleFor('Unit | Property | .is');

test('returns is value', function(assert) {
  fixture('<input type="checkbox" checked>');

  let page = create({
    foo: is(':checked', ':input')
  });

  assert.equal(page.foo, true);
});

test("raises an error when the element doesn't exist", function(assert) {
  let page = create({
    foo: {
      checked: is(':checked', ':input')
    }
  });

  assert.throws(() => page.foo.checked, /page\.foo\.checked/);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><input></div>
    <div class="scope"><input type="checkbox" checked></div>
    <div><input></div>
  `);

  let page = create({
    foo: is(':checked', ':input', { scope: '.scope' })
  });

  assert.equal(page.foo, true);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><input></div>
    <div class="scope"><input type="checkbox" checked></div>
    <div><input></div>
  `);

  let page = create({
    scope: '.scope',

    foo: is(':checked', ':input')
  });

  assert.equal(page.foo, true);
});

test('resets scope', function(assert) {
  fixture(`
    <div class="scope"></div>
    <div><input type="checkbox" checked></div>
  `);

  let page = create({
    scope: '.scope',

    foo: is(':checked', ':input', { resetScope: true })
  });

  assert.ok(page.foo);
});

test_throws_if_not_multiple(function() {
  fixture(`
    <input type="checkbox" checked>
    <input type="checkbox" checked>
  `);

  let page = create({
    foo: is(':checked', ':input')
  });

  return page.foo;
});

test('matches multiple elements', function(assert) {
  fixture(`
    <input class="foo" type="checkbox" checked>
    <input class="foo" type="checkbox" checked="checked">
    <input class="foo" type="checkbox" checked=true>
    <input class="bar" type="checkbox" checked>
    <input class="bar" type="checkbox">
  `);

  let page = create({
    foo: is(':checked', 'input.foo', { multiple: true }),
    bar: is(':checked', 'input.bar', { multiple: true })
  });

  assert.equal(page.foo, true);
  assert.equal(page.bar, false);
});

test('finds element by index', function(assert) {
  fixture(`
    <input>
    <input type="checkbox" checked>
  `);

  let page = create({
    foo: is(':checked', ':input', { at: 1 })
  });

  assert.ok(page.foo);
});


test('looks for elements outside the testing container', function(assert) {
  fixture('<h1 class="foo">lorem ipsum</h1>', { useAlternateContainer: true  });

  var page = create({
    foo: is('.foo', 'h1', { testContainer: '#alternate-ember-testing'  })
  });

  assert.equal(page.foo, true);
});
