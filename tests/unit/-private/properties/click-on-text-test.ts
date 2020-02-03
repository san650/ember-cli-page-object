import { moduleForProperty } from '../../../helpers/properties';
import { create, clickOnText } from 'ember-cli-page-object';

moduleForProperty('clickOnText', function(test) {
  test('calls click helper', async function(assert) {
    assert.expect(2);

    let page = create({
      foo: clickOnText('fieldset'),
      bar: clickOnText('button')
    });

    await this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.$('fieldset :contains("Lorem"):last').one('click', function() {
      assert.ok(true);
    });

    await this.adapter.await(page.foo('Lorem'));

    this.adapter.$('button:contains("Lorem")').one('click', function() {
      assert.ok(true);
    });

    await this.adapter.await(page.bar('Lorem'));
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(2);

    let page = create({
      foo: clickOnText('fieldset', { scope: '.scope' }),
      bar: clickOnText('button', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div class="scope">
        <fieldset>
          <button>Lorem</button>
          <button>Ipsum</button>
        </fieldset>
      </div>
    `);

    this.adapter.$('.scope fieldset :contains("Lorem"):last').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Lorem'));

    this.adapter.$('.scope button:contains("Lorem")').one('click', () => assert.ok(1));

    await this.adapter.await(page.bar('Lorem'));
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(2);

    let page = create({
      scope: '.scope',
      foo: clickOnText('fieldset'),
      bar: clickOnText('button')
    });

    await this.adapter.createTemplate(this, page, `
      <div class="scope">
        <fieldset>
          <button>Lorem</button>
          <button>Ipsum</button>
        </fieldset>
      </div>
    `);

    this.adapter.$('.scope fieldset :contains("Lorem"):last').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Lorem'));

    this.adapter.$('.scope button:contains("Lorem")').one('click', () => assert.ok(1));

    await this.adapter.await(page.bar('Lorem'));
  });

  test('resets scope', async function(assert) {
    assert.expect(2);

    let page = create({
      scope: '.scope',
      foo: clickOnText('fieldset', { resetScope: true }),
      bar: clickOnText('button', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.$('fieldset :contains("Lorem"):last').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Lorem'));

    this.adapter.$('button:contains("Lorem")').one('click', () => assert.ok(1));

    await this.adapter.await(page.bar('Lorem'));
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page;

    page = create({
      dummy: 'value',

      foo: clickOnText()
    });

    await this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    let ret = page.foo('dummy text');
    assert.ok(ret.foo);
    await this.adapter.await(ret);
  });

  test('finds element by index', async function(assert) {
    assert.expect(2);

    let page = create({
      foo: clickOnText('fieldset', { at: 2 }),
      bar: clickOnText('button', { at: 2 })
    });

    await this.adapter.createTemplate(this, page, `
      <fieldset>
        <button>Lorem</button>
        <button>Lorem</button>
        <button>Lorem</button>
        <button>Ipsum</button>
      </fieldset>
    `);

    this.adapter.$('fieldset :contains("Lorem"):eq(2)').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Lorem'));

    this.adapter.$('button:contains("Lorem"):eq(2)').one('click', () => assert.ok(1));

    await this.adapter.await(page.bar('Lorem'));
  });

  test('looks for elements outside the testing container', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: clickOnText('button', { testContainer: expectedContext })
    });

    await this.adapter.createTemplate(this, page, '<button>Lorem</button>', { useAlternateContainer: true });

    this.adapter.$('button', true).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Lorem'));
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      testContainer: expectedContext,
      foo: clickOnText('button')
    });

    await this.adapter.createTemplate(this, page, '<button>Lorem</button>', { useAlternateContainer: true });
    await this.adapter.createTemplate(this, page, '<button>Lorem</button>');

    this.adapter.$('button', true).one('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Lorem'));
  });

  test("raises an error when the element doesn't exist", async function(assert) {
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

    await this.adapter.createTemplate(this, page);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('Lorem');
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });

  test("doesn't raise an error when the element is not visible and `visible` is not set", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickOnText('button')
    });

    await this.adapter.createTemplate(this, page, '<button style="display:none">Click me</button>');

    this.adapter.$('button').on('click', () => assert.ok(1));

    await this.adapter.await(page.foo('Click me'));
  });

  test('raises an error when the element is not visible and `visible` is true', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: clickOnText('button', { visible: true })
    });

    await this.adapter.createTemplate(this, page, '<button style="display:none">Click me</button>');

    await this.adapter.throws(assert, function() {
      return page.foo('Click me');
    }, /page\.foo/, 'Element not found');
  });
});
