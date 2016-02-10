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
