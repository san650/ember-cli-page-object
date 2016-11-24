import { moduleForProperty } from '../helpers/properties';
import { create, clickOnText } from 'ember-cli-page-object';

moduleForProperty('clickOnText', function(test) {
  test('calls click helper', function(assert) {
    assert.expect(2);

    let expectedSelector;
    let page;

    page = create({
      foo: clickOnText('fieldset'),
      bar: clickOnText('button')
    });

    this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    this.adapter.andThen(() => {
      expectedSelector = 'fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
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

    this.adapter.createTemplate(this, page, `
      <div class="scope">
        <fieldset>
          <button>Lorem</button>
          <button>Ipsum</button>
        </fieldset>
      </div>
    `);

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    this.adapter.andThen(() => {
      expectedSelector = '.scope fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
      expectedSelector = '.scope button:contains("Lorem")';
      page.bar('Lorem');
    });

    return this.adapter.wait();
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

    this.adapter.createTemplate(this, page, `
      <div class="scope">
        <fieldset>
          <button>Lorem</button>
          <button>Ipsum</button>
        </fieldset>
      </div>
    `);

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    this.adapter.andThen(() => {
      expectedSelector = '.scope fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
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

    this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    this.adapter.andThen(() => {
      expectedSelector = 'fieldset :contains("Lorem"):last';
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
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

    this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    this.adapter.click(() => {});

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

    this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Lorem</button>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    this.adapter.andThen(() => {
      expectedSelector = 'fieldset :contains("Lorem"):eq(2)';
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
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

    this.adapter.createTemplate(this, page, '<button>Lorem</button>', { useAlternateContainer: true });

    this.adapter.click((_, actualContext) => {
      assert.equal(actualContext, expectedContext);
    });

    this.adapter.andThen(() => {
      page.foo('Lorem');
    });
  });

  test('looks for elements within test container specified at node level', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      testContainer: expectedContext,
      foo: clickOnText('button')
    });

    this.adapter.createTemplate(this, page, '<button>Lorem</button>', { useAlternateContainer: true });

    this.adapter.click((_, actualContext) => {
      assert.equal(actualContext, expectedContext);
    });

    this.adapter.andThen(() => {
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

    this.adapter.createTemplate(this, page);

    this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('Lorem');
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickOnText('button')
    });

    this.adapter.createTemplate(this, page, '<button style="display:none">Click me</button>');

    this.adapter.click(() => {
      assert.ok(true, 'Element is clicked');
    });

    page.foo('Click me');

    return this.adapter.wait();
  });

  test('raises an error when the element is not visible and `visible` is true', function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickOnText('button', { visible: true })
    });

    this.adapter.createTemplate(this, page, '<button style="display:none">Click me</button>');

    this.adapter.throws(assert, function() {
      return page.foo('Click me');
    }, /page\.foo/, 'Element not found');
  });
});
