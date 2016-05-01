import { test } from 'qunit';
import { moduleFor, fixture } from '../test-helper';
import { create, clickOnText } from '../../page-object';

moduleFor('Unit | Property | .clickOnText');

test('calls Ember\'s click helper', function(assert) {
  assert.expect(2);

  fixture(`
    <fieldset>
      <button>Lorem</button>
      <button>Ipsum</button>
    </fieldset>
  `);

  let expectedSelector, page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickOnText('fieldset'),
    bar: clickOnText('button')
  });

  andThen(() => {
    expectedSelector = 'fieldset :contains("Lorem"):last';
    page.foo('Lorem');
  });

  andThen(() => {
    expectedSelector = 'button:contains("Lorem")';
    page.bar('Lorem');
  });
});

test('looks for elements inside the scope', function(assert) {
  assert.expect(2);

  fixture(`
    <div class="scope">
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    </div>
  `);

  let expectedSelector, page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickOnText('fieldset', { scope: '.scope' }),
    bar: clickOnText('button', { scope: '.scope' })
  });

  andThen(() => {
    expectedSelector = '.scope fieldset :contains("Lorem"):last';
    page.foo('Lorem');
  });

  andThen(() => {
    expectedSelector = '.scope button:contains("Lorem")';
    page.bar('Lorem');
  });
});

test('looks for elements inside page\'s scope', function(assert) {
  assert.expect(2);

  fixture(`
    <div class="scope">
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    </div>
  `);

  let page, expectedSelector;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    scope: '.scope',
    foo: clickOnText('fieldset'),
    bar: clickOnText('button')
  });

  andThen(() => {
    expectedSelector = '.scope fieldset :contains("Lorem"):last';
    page.foo('Lorem');
  });

  andThen(() => {
    expectedSelector = '.scope button:contains("Lorem")';
    page.bar('Lorem');
  });
});

test('resets scope', function(assert) {
  assert.expect(2);

  fixture(`
    <fieldset>
      <button>Lorem</button>
      <button>Ipsum</button>
    </fieldset>
  `);

  let page, expectedSelector;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    scope: '.scope',
    foo: clickOnText('fieldset', { resetScope: true }),
    bar: clickOnText('button', { resetScope: true })
  });

  andThen(() => {
    expectedSelector = 'fieldset :contains("Lorem"):last';
    page.foo('Lorem');
  });

  andThen(() => {
    expectedSelector = 'button:contains("Lorem")';
    page.bar('Lorem');
  });
});

test('returns target object', function(assert) {
  fixture('<button>dummy text</button>');
  assert.expect(1);

  let page;

  window.click = function() {
  };

  page = create({
    dummy: 'value',

    foo: clickOnText()
  });

  assert.equal(page.foo('dummy text'), page);
});

test('finds element by index', function(assert) {
  assert.expect(2);

  fixture(`
    <fieldset>
      <button>Lorem</button>
      <button>Lorem</button>
      <button>Lorem</button>
      <button>Ipsum</button>
    </fieldset>
  `);

  let expectedSelector, page;

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  page = create({
    foo: clickOnText('fieldset', { at: 2 }),
    bar: clickOnText('button', { at: 2 })
  });

  andThen(() => {
    expectedSelector = 'fieldset :contains("Lorem"):eq(2)';
    page.foo('Lorem');
  });

  andThen(() => {
    expectedSelector = 'button:contains("Lorem"):eq(2)';
    page.bar('Lorem');
  });
});

test('looks for elements outside the testing container', function(assert) {
  assert.expect(1);

  fixture('<button>Lorem</button>', { useAlternateContainer: true });

  let expectedContext = '#alternate-ember-testing',
      page;

  window.click = function(_, actualContext) {
    assert.equal(actualContext, expectedContext);
  };

  page = create({
    foo: clickOnText('button', { testContainer: expectedContext })
  });

  andThen(() => {
    page.foo('Lorem');
  });
});

test("raises an error when the element doesn't exist", function(assert) {
  assert.expect(1);

  var done = assert.async();

  let page = create({
    foo: {
      bar: {
        baz: {
          qux: clickOnText('button')
        }
      }
    }
  });

  page.foo.bar.baz.qux('Lorem').then().catch(error => {
    assert.ok(/page\.foo\.bar\.baz\.qux/.test(error.toString()), 'Element not found');
  }).finally(done);
});

test("doesn't raise an error when the element is not visible and `visible` is not set", function(assert) {
  fixture('<button style="display:none">Click me</button>');
  assert.expect(1);

  window.click = function() {
    assert.ok(true, 'Element is clicked');
  };

  let page = create({
    foo: clickOnText('button')
  });

  page.foo('Click me');
});

test('raises an error when the element is not visible and `visible` is true', function(assert) {
  fixture('<button style="display:none">Click me</button>');
  assert.expect(1);

  let done = assert.async();
  let page = create({
    foo: clickOnText('button', { visible: true })
  });

  page.foo('Click me').then().catch(error => {
    assert.ok(/page\.foo/.test(error.toString()), 'Element not found');
  }).finally(done);
});
