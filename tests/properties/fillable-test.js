import { moduleForProperty } from '../helpers/properties';
import { create, fillable, selectable } from 'ember-cli-page-object';

moduleForProperty('fillable', function(test, adapter) {
  test("calls Ember's fillIn helper", function(assert) {
    assert.expect(2);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page;

    page = create({
      foo: fillable(expectedSelector)
    });

    adapter.fillIn((actualSelector, actualContext, actualText) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualText, expectedText);
    });

    adapter.createTemplate(this, page, '<input>');

    page.foo(expectedText);
  });

  test('looks for inputs with data-test="clue" attributes', function(assert) {
    let expectedText = 'dummy text';
    let clue = 'clue';
    let page;

    page = create({
      scope: '.scope',

      foo: fillable()
    });

    adapter.createTemplate(this, page, '<div class="scope"><input data-test="clue"></div>');

    adapter.fillIn((actualSelector, actualContext, actualText) => {
      assert.ok(/.scope input\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/.scope input\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/.scope input\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/.scope input\[name="clue"\]/.test(actualSelector));
      assert.ok(/.scope input#clue/.test(actualSelector));

      assert.ok(/.scope textarea\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/.scope textarea\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/.scope textarea\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/.scope textarea\[name="clue"\]/.test(actualSelector));
      assert.ok(/.scope textarea#clue/.test(actualSelector));

      assert.ok(/.scope select\[data-test="clue"\]/.test(actualSelector));
      assert.ok(/.scope select\[aria-label="clue"\]/.test(actualSelector));
      assert.ok(/.scope select\[placeholder="clue"\]/.test(actualSelector));
      assert.ok(/.scope select\[name="clue"\]/.test(actualSelector));
      assert.ok(/.scope select#clue/.test(actualSelector));
      assert.equal(actualText, expectedText);
    });

    page.foo(clue, expectedText);
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input', { scope: '.scope' })
    });

    adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, '.scope input');
    });

    page.foo('dummy text');
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: fillable('input')
    });

    adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, '.scope input');
    });

    adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    page.foo('dummy text');
  });

  test('resets scope', function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: fillable('input', { resetScope: true })
    });

    adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, 'input');
    });

    adapter.createTemplate(this, page, '<input>');

    page.foo('dummy text');
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input')
    });

    adapter.fillIn(() => {});

    adapter.createTemplate(this, page, '<input>');

    assert.equal(page.foo(), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: fillable('input', { at: 3 })
    });

    adapter.fillIn((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    adapter.createTemplate(this, page, '<input><input><input><input>');

    page.foo();
  });

  test('is aliased to selectable', function(assert) {
    assert.expect(2);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page = create({
      foo: selectable(expectedSelector)
    });

    adapter.createTemplate(this, page, '<input>');

    adapter.fillIn((actualSelector, actualContext, actualText) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualText, expectedText);
    });

    page.foo(expectedText);
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(3);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      foo: fillable(expectedSelector, { testContainer: expectedContext })
    });

    adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    adapter.fillIn((actualSelector, actualContext, actualText) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(actualContext, expectedContext);
      assert.equal(actualText, expectedText);
    });

    page.foo(expectedText);
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

    adapter.createTemplate(this, page);

    adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('lorem');
    }, /page\.foo\.bar\.baz\.qux\(\)/, 'Element not found');
  });
});
