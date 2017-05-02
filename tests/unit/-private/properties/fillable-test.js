import { moduleForProperty } from '../../../helpers/properties';
import { create, fillable, selectable } from 'ember-cli-page-object';

moduleForProperty('fillable', function(test) {
  test("calls fillIn method belonging to execution context", function(assert) {
    assert.expect(2);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page;

    page = create({
      foo: fillable(expectedSelector)
    });

    this.adapter.fillIn((actualSelector, actualContext, options, actualContent) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualContent, expectedText);
    });

    this.adapter.createTemplate(this, page, '<input>');

    page.foo(expectedText);

    return this.adapter.wait();
  });

  test('looks for inputs or contenteditables with data-test="clue" attributes', function(assert) {
    let expectedText = 'dummy text';
    let clue = 'clue';
    let page;

    page = create({
      scope: '.scope',

      foo: fillable()
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input data-test="clue"></div>');

    this.adapter.fillIn((actualSelector, actualContext, options, actualContent) => {
      assert.ok(/\.scope input\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/\.scope input\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/\.scope input\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/\.scope input\[name="clue"\]/.test(actualSelector));
      assert.ok(/\.scope input#clue/.test(actualSelector));

      assert.ok(/\.scope textarea\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/\.scope textarea\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/\.scope textarea\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/\.scope textarea\[name="clue"\]/.test(actualSelector));
      assert.ok(/\.scope textarea#clue/.test(actualSelector));

      assert.ok(/\.scope select\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/\.scope select\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/\.scope select\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/\.scope select\[name="clue"\]/.test(actualSelector));
      assert.ok(/\.scope select#clue/.test(actualSelector));

      assert.ok(/\.scope \[contenteditable\]\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/\.scope \[contenteditable\]\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/\.scope \[contenteditable\]\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/\.scope \[contenteditable\]\[name="clue"\]/.test(actualSelector));
      assert.ok(/\.scope \[contenteditable\]#clue/.test(actualSelector));

      assert.equal(actualContent, expectedText);
    });

    page.foo(clue, expectedText);

    return this.adapter.wait();
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    this.adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, '.scope input');
    });

    page.foo('dummy text');

    return this.adapter.wait();
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: fillable('input')
    });

    this.adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, '.scope input');
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    page.foo('dummy text');

    return this.adapter.wait();
  });

  test('resets scope', function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: fillable('input', { resetScope: true })
    });

    this.adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, 'input');
    });

    this.adapter.createTemplate(this, page, '<input>');

    page.foo('dummy text');

    return this.adapter.wait();
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input')
    });

    this.adapter.fillIn(() => {});

    this.adapter.createTemplate(this, page, '<input>');

    assert.equal(page.foo(), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: fillable('input', { at: 3 })
    });

    this.adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    this.adapter.createTemplate(this, page, '<input><input><input><input>');

    page.foo();

    return this.adapter.wait();
  });

  test('is aliased to selectable', function(assert) {
    assert.expect(2);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page = create({
      foo: selectable(expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<input>');

    this.adapter.fillIn((actualSelector, actualContext, options, actualContent) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualContent, expectedText);
    });

    page.foo(expectedText);

    return this.adapter.wait();
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(3);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      foo: fillable(expectedSelector, { testContainer: expectedContext })
    });

    this.adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    this.adapter.fillIn((actualSelector, actualContext, options, actualContent) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualContext, expectedContext);
      assert.equal(actualContent, expectedText);
    });

    page.foo(expectedText);

    return this.adapter.wait();
  });

  test('looks for elements within test container specified at node level', function(assert) {
    assert.expect(3);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      testContainer: expectedContext,
      foo: fillable(expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    this.adapter.fillIn((actualSelector, actualContext, options, actualContent) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualContext, expectedContext);
      assert.equal(actualContent, expectedText);
    });

    page.foo(expectedText);

    return this.adapter.wait();
  });

  test("raises an error when the element doesn't exist", function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: fillable('input')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('lorem');
    }, /page\.foo\.bar\.baz\.qux\(\)/, 'Element not found');
  });

  test('raises an error when the element has contenteditable="false"', function(assert) {
    let page = create({
      foo: fillable('div')
    });

    this.adapter.createTemplate(this, page, '<div contenteditable="false">');

    this.adapter.throws(assert, function() {
      return page.foo('lorem');
    }, /contenteditable="false"/, 'Element should not be fillable because contenteditable="false"');
  });
});
