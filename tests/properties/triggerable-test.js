import { moduleForProperty } from '../helpers/properties';
import { create, triggerable } from 'ember-cli-page-object';

moduleForProperty('triggerable', function(test) {
  test("calls Ember's triggerEvent helper with proper args", function(assert) {
    assert.expect(2);

    let expectedSelector = 'span';
    let page = create({
      foo: triggerable('focus', expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<span></span>');

    this.adapter.triggerEvent((actualSelector, _, event) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(event, 'focus');
    });

    page.foo();
  });

  test("calls Ember's triggerEvent helper with event options", function(assert) {
    assert.expect(3);

    let expectedSelector = 'span';
    let page = create({
      foo: triggerable('keypress', expectedSelector, { eventProperties: { keyCode: 13 } })
    });

    this.adapter.createTemplate(this, page, '<span></span>');

    this.adapter.triggerEvent((actualSelector, _, event, options) => {
      assert.equal(actualSelector, expectedSelector);
      assert.equal(event, 'keypress');
      assert.equal(options.keyCode, 13);
    });

    page.foo();
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'span', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><span></span></div>');

    this.adapter.triggerEvent((actualSelector) => {
      assert.equal(actualSelector, '.scope span');
    });

    page.foo();
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: triggerable('focus', 'span')
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><span></span></div>');
    this.adapter.triggerEvent((actualSelector) => {
      assert.equal(actualSelector, '.scope span');
    });

    page.foo();
  });

  test('resets scope', function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: triggerable('focus', 'span', { resetScope: true })
    });

    this.adapter.createTemplate(this, page, '<span></span>');

    this.adapter.triggerEvent((actualSelector) => {
      assert.equal(actualSelector, 'span');
    });

    page.foo();
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'span')
    });

    this.adapter.createTemplate(this, page, '<span></span>');
    this.adapter.triggerEvent(() => {});

    assert.equal(page.foo(), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(1);

    let expectedSelector = 'span:eq(3)';
    let page = create({
      foo: triggerable('focus', 'span', { at: 3 })
    });

    this.adapter.createTemplate(this, page, '<span></span><span></span><span></span><span></span>');
    this.adapter.triggerEvent((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.foo();
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      foo: triggerable('focus', 'span', { testContainer: expectedContext })
    });

    this.adapter.createTemplate(this, page, '<span></span>', { useAlternateContainer: true });
    this.adapter.triggerEvent((_, actualContext) => {
      assert.equal(actualContext, expectedContext);
    });

    page.foo();
  });

  test("raises an error when the element doesn't exist", function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: triggerable('focus', 'button')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });
});
