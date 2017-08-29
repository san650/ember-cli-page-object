import { moduleForProperty } from '../../../helpers/properties';
import { create, clickOnText } from 'ember-cli-page-object';

moduleForProperty('clickOnText', function(test) {
  test('calls click helper', function(assert) {
    assert.expect(2);

    let page = create({
      foo: clickOnText('fieldset'),
      bar: clickOnText('button')
    });

    this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.andThen(() => {
      this.adapter.$('fieldset :contains("Lorem"):last').one('click', function() {
        assert.ok(true);
      });

      page.foo('Lorem');

      return this.adapter.wait();
    });

    this.adapter.andThen(() => {
      this.adapter.$('button:contains("Lorem")').one('click', function() {
        assert.ok(true);
      });
      page.bar('Lorem');

      return this.adapter.wait();
    });
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(2);

    let page = create({
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

    this.adapter.andThen(() => {
      this.adapter.$('.scope fieldset :contains("Lorem"):last').one('click', () => assert.ok(1));
      page.foo('Lorem');

      return this.adapter.wait();
    });

    this.adapter.andThen(() => {
      this.adapter.$('.scope button:contains("Lorem")').one('click', () => assert.ok(1));
      page.bar('Lorem');

      return this.adapter.wait();
    });

    return this.adapter.wait();
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(2);

    let page = create({
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

    this.adapter.andThen(() => {
      this.adapter.$('.scope fieldset :contains("Lorem"):last').one('click', () => assert.ok(1));
      page.foo('Lorem');

      return this.adapter.wait();
    });

    this.adapter.andThen(() => {
      this.adapter.$('.scope button:contains("Lorem")').one('click', () => assert.ok(1));
      page.bar('Lorem');

      return this.adapter.wait();
    });
  });

  test('resets scope', function(assert) {
    assert.expect(2);

    let page = create({
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

    this.adapter.andThen(() => {
      this.adapter.$('fieldset :contains("Lorem"):last').one('click', () => assert.ok(1));
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
      this.adapter.$('button:contains("Lorem")').one('click', () => assert.ok(1));
      page.bar('Lorem');
      return this.adapter.wait();
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

    assert.equal(page.foo('dummy text'), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(2);

    let page = create({
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

    this.adapter.andThen(() => {
      this.adapter.$('fieldset :contains("Lorem"):eq(2)').one('click', () => assert.ok(1));
      page.foo('Lorem');
    });

    this.adapter.andThen(() => {
      this.adapter.$('button:contains("Lorem"):eq(2)').one('click', () => assert.ok(1));
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

    this.adapter.andThen(() => {
      this.adapter.$('button', true).one('click', () => assert.ok(1));
      page.foo('Lorem');
    });
  });

  test('looks for elements within test container specified at node level', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      testContainer: expectedContext,
      foo: clickOnText('button')
    });

    this.adapter.createTemplate(this, page, '<button>Lorem</button>', { useAlternateContainer: true });
    this.adapter.createTemplate(this, page, '<button>Lorem</button>');

    this.adapter.andThen(() => {
      this.adapter.$('button', true).one('click', () => assert.ok(1));
      page.foo('Lorem');

      return this.adapter.wait();
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
