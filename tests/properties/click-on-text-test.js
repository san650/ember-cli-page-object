import { moduleForProperty } from '../helpers/properties';
import { create, clickOnText } from 'ember-cli-page-object';

moduleForProperty('clickOnText', function(test, adapter) {
  test('calls click helper', function(assert) {
    assert.expect(2);

    let expectedSelector;
    let page;

    page = create({
      foo: clickOnText('fieldset'),
      bar: clickOnText('button')
    });

    adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    adapter.andThen(() => {
      expectedSelector = 'fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    adapter.andThen(() => {
      expectedSelector = 'button:contains("Lorem")';
      page.bar('Lorem');
    });
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(2);

    let expectedSelector;
    let page;

    page = create({
      foo: clickOnText('fieldset', { scope: '.scope' }),
      bar: clickOnText('button', { scope: '.scope' })
    });

    adapter.createTemplate(this, page, `
      <div class="scope">
        <fieldset>
          <button>Lorem</button>
          <button>Ipsum</button>
        </fieldset>
      </div>
    `);

    adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    adapter.andThen(() => {
      expectedSelector = '.scope fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    adapter.andThen(() => {
      expectedSelector = '.scope button:contains("Lorem")';
      page.bar('Lorem');
    });
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(2);

    let page;
    let expectedSelector;

    page = create({
      scope: '.scope',
      foo: clickOnText('fieldset'),
      bar: clickOnText('button')
    });

    adapter.createTemplate(this, page, `
      <div class="scope">
        <fieldset>
          <button>Lorem</button>
          <button>Ipsum</button>
        </fieldset>
      </div>
    `);

    adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    adapter.andThen(() => {
      expectedSelector = '.scope fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    adapter.andThen(() => {
      expectedSelector = '.scope button:contains("Lorem")';
      page.bar('Lorem');
    });
  });

  test('resets scope', function(assert) {
    assert.expect(2);

    let page;
    let expectedSelector;

    page = create({
      scope: '.scope',
      foo: clickOnText('fieldset', { resetScope: true }),
      bar: clickOnText('button', { resetScope: true })
    });

    adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    adapter.andThen(() => {
      expectedSelector = 'fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    adapter.andThen(() => {
      expectedSelector = 'button:contains("Lorem")';
      page.bar('Lorem');
    });
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page;

    page = create({
      dummy: 'value',

      foo: clickOnText()
    });

    adapter.createTemplate(this, page, '<button>dummy text</button>');

    adapter.click(() => {});

    assert.equal(page.foo('dummy text'), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(2);

    let expectedSelector;
    let page;

    page = create({
      foo: clickOnText('fieldset', { at: 2 }),
      bar: clickOnText('button', { at: 2 })
    });

    adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Lorem</button>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    adapter.andThen(() => {
      expectedSelector = 'fieldset :contains("Lorem"):eq(2)';
      page.foo('Lorem');
    });

    adapter.andThen(() => {
      expectedSelector = 'button:contains("Lorem"):eq(2)';
      page.bar('Lorem');
    });
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: clickOnText('button', { testContainer: expectedContext })
    });

    adapter.createTemplate(this, page, '<button>Lorem</button>', { useAlternateContainer: true });

    adapter.click((_, actualContext) => {
      assert.equal(actualContext, expectedContext);
    });

    adapter.andThen(() => {
      page.foo('Lorem');
    });
  });

  test("raises an error when the element doesn't exist", function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: clickOnText('button')
          }
        }
      }
    });

    adapter.createTemplate(this, page);

    adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('Lorem');
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickOnText('button')
    });

    adapter.createTemplate(this, page, '<button style="display:none">Click me</button>');

    adapter.click(() => {
      assert.ok(true, 'Element is clicked');
    });

    page.foo('Click me');
  });

  test('raises an error when the element is not visible and `visible` is true', function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickOnText('button', { visible: true })
    });

    adapter.createTemplate(this, page, '<button style="display:none">Click me</button>');

    adapter.throws(assert, function() {
      return page.foo('Click me');
    }, /page\.foo/, 'Element not found');
  });
});
