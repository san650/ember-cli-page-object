import { moduleForProperty } from '../../../helpers/properties';
import { create, clickable } from 'ember-cli-page-object';

moduleForProperty('clickable', function(test) {
  test('calls click helper', function(assert) {
    assert.expect(1);

    let expectedSelector = 'button';
    let page = create({
      foo: clickable(expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.andThen(() => {
      this.adapter.$(expectedSelector).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(1);

    let expectedSelector = '.scope span';
    let page;

    page = create({
      foo: clickable('span', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><span>Click me</span></div>');

    this.adapter.andThen(() => {
      this.adapter.$(expectedSelector).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(1);

    let expectedSelector = '.scope span';
    let page;

    page = create({
      scope: '.scope',

      foo: clickable('span')
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><span>Click me</span></div>');

    return this.adapter.andThen(() => {
      this.adapter.$(expectedSelector).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test('resets scope', function(assert) {
    assert.expect(1);

    let expectedSelector = 'span';
    let page;

    page = create({
      scope: '.scope',
      foo: clickable('span', { resetScope: true })
    });

    this.adapter.createTemplate(this, page, '<span>Click me</span>');

    return this.adapter.andThen(() => {
      this.adapter.$(expectedSelector).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickable('span')
    });

    this.adapter.createTemplate(this, page, '<span>Click me</span>');

    assert.equal(page.foo(), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(1);

    let expectedSelector = 'span:eq(3)';
    let page = create({
      foo: clickable('span', { at: 3 })
    });

    this.adapter.createTemplate(this, page, '<span></span><span></span><span>Click me</span><span></span>');

    return this.adapter.andThen(() => {
      this.adapter.$(expectedSelector).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: clickable('span', { testContainer: expectedContext })
    });

    this.adapter.createTemplate(this, page, '<span>Click me</span>', { useAlternateContainer: true });

    return this.adapter.andThen(() => {
      this.adapter.$('span', expectedContext).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test('looks for elements within test container specified at node level', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      testContainer: expectedContext,
      foo: clickable('span')
    });

    this.adapter.createTemplate(this, page, '<span>Click me</span>', { useAlternateContainer: true });

    return this.adapter.andThen(() => {
      this.adapter.$('span', expectedContext).one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test("raises an error when the element doesn't exist", function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: clickable('button')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');

    return this.adapter.wait();
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickable('span')
    });

    this.adapter.createTemplate(this, page, '<span style="display:none">Click me</span>');

    return this.adapter.andThen(() => {
      this.adapter.$('span').one('click', () => assert.ok(1));
      page.foo();

      return this.adapter.wait();
    });
  });

  test('raises an error when the element is not visible and `visible` is true', function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickable('span', { visible: true })
    });

    this.adapter.createTemplate(this, page, '<span style="display:none">Click me</span>');

    this.adapter.throws(assert, function() {
      return page.foo();
    }, /page\.foo/, 'Element not found');
  });
});
