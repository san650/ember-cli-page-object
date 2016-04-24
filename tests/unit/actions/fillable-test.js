import { test } from 'qunit';
import { moduleFor, fixture } from '../test-helper';
import { create, fillable, selectable } from '../../page-object';

moduleFor('Unit | Property | .fillable');

test("calls Ember's fillIn helper", function(assert) {
  fixture('<input>');
  assert.expect(2);

  let expectedSelector = 'input',
      expectedText = 'dummy text',
      page;


  window.fillIn = function(actualSelector, actualText) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(actualText, expectedText);
  };

  page = create({
    foo: fillable(expectedSelector)
  });

  page.foo(expectedText);
});

test('looks for elements inside the scope', function(assert) {
  fixture('<div class="scope"><input></div>');
  assert.expect(1);

  let page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope input');
  };

  page = create({
    foo: fillable('input', { scope: '.scope' })
  });

  page.foo('dummy text');
});

test("looks for elements inside page's scope", function(assert) {
  fixture('<div class="scope"><input></div>');
  assert.expect(1);

  let page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope input');
  };

  page = create({
    scope: '.scope',

    foo: fillable('input')
  });

  page.foo('dummy text');
});

test('resets scope', function(assert) {
  fixture('<input>');
  assert.expect(1);

  let page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, 'input');
  };

  page = create({
    scope: '.scope',
    foo: fillable('input', { resetScope: true })
  });

  page.foo('dummy text');
});

test('returns target object', function(assert) {
  fixture('<input>');
  assert.expect(1);

  let page;

  window.fillIn = function() { };

  page = create({
    foo: fillable('input')
  });

  assert.equal(page.foo(), page);
});

test('finds element by index', function(assert) {
  fixture('<input><input><input><input>');
  assert.expect(1);

  let expectedSelector = 'input:eq(3)',
      page;

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: fillable('input', { at: 3 })
  });

  page.foo();
});

test('is aliased to selectable', function(assert) {
  fixture('<input>');
  assert.expect(2);

  let expectedSelector = 'input',
      expectedText = 'dummy text',
      page;


  window.fillIn = function(actualSelector, actualText) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(actualText, expectedText);
  };

  page = create({
    foo: selectable(expectedSelector)
  });

  page.foo(expectedText);
});

test('looks for elements outside the testing container', function(assert) {
  fixture('<input>', { useAlternateContainer: true });
  assert.expect(3);

  let expectedContext = '#alternate-ember-testing',
      expectedSelector = 'input',
      expectedText = 'foo',
      page;


  window.fillIn = function(actualSelector, actualContext, actualText) {
    assert.equal(actualSelector, expectedSelector);
    assert.equal(actualContext, expectedContext);
    assert.equal(actualText, expectedText);
  };

  page = create({
    foo: fillable(expectedSelector, { testContainer: expectedContext })
  });

  page.foo(expectedText);
});

test("raises an error when the element doesn't exist", function(assert) {
  assert.expect(1);

  var done = assert.async();

  let page = create({
    foo: {
      bar: {
        baz: {
          qux: fillable('input')
        }
      }
    }
  });

  page.foo.bar.baz.qux('lorem').then().catch(error => {
    assert.ok(/page\.foo\.bar\.baz\.qux/.test(error.toString()), 'Element not found');
  }).finally(done);
});
