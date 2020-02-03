import { moduleForProperty } from '../../../helpers/properties';
import { create, clickable } from 'ember-cli-page-object';

moduleForProperty('clickable', function(test) {
  test('calls click helper', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'button';
    let page = create({
      foo: clickable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.$(expectedSelector).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(1);

    let expectedSelector = '.scope span';
    let page;

    page = create({
      foo: clickable('span', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><span>Click me</span></div>');

    this.adapter.$(expectedSelector).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(1);

    let expectedSelector = '.scope span';
    let page;

    page = create({
      scope: '.scope',

      foo: clickable('span')
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><span>Click me</span></div>');

    this.adapter.$(expectedSelector).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('resets scope', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'span';
    let page;

    page = create({
      scope: '.scope',
      foo: clickable('span', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, '<span>Click me</span>');

    this.adapter.$(expectedSelector).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickable('span')
    });

    await this.adapter.createTemplate(this, page, '<span>Click me</span>');

    let ret = page.foo();
    assert.ok(ret.foo);
    await this.adapter.await(ret);
  });

  test('finds element by index', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'span:eq(3)';
    let page = create({
      foo: clickable('span', { at: 3 })
    });

    await this.adapter.createTemplate(this, page, '<span></span><span></span><span>Click me</span><span></span>');

    this.adapter.$(expectedSelector).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('looks for elements outside the testing container', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: clickable('span', { testContainer: expectedContext })
    });

    await this.adapter.createTemplate(this, page, '<span>Click me</span>', { useAlternateContainer: true });

    this.adapter.$('span', expectedContext).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      testContainer: expectedContext,
      foo: clickable('span')
    });

    await this.adapter.createTemplate(this, page, '<span>Click me</span>', { useAlternateContainer: true });

    this.adapter.$('span', expectedContext).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test("raises an error when the element doesn't exist", async function(assert) {
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

    await this.adapter.createTemplate(this, page);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickable('span')
    });

    await this.adapter.createTemplate(this, page, '<span style="display:none">Click me</span>');

    this.adapter.$('span').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('raises an error when the element is not visible and `visible` is true', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickable('span', { visible: true })
    });

    await this.adapter.createTemplate(this, page, '<span style="display:none">Click me</span>');

    await this.adapter.throws(assert, function() {
      return page.foo();
    }, /page\.foo/, 'Element not found');
  });
});
