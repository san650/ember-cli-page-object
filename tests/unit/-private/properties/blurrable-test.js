import { moduleForProperty } from '../../../helpers/properties';
import { create, blurrable } from 'ember-cli-page-object';

moduleForProperty('blurrable', function(test, adapter) {
  test('calls blur with proper args', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let page = create({
      foo: blurrable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$(expectedSelector).focus().on('blur', () => {
      assert.ok(1);
    });

    await this.adapter.await(page.foo());
  });

  test('actually blurs the element', async function(assert) {
    assert.expect(2);

    let expectedSelector = 'input';
    let page = create({
      foo: blurrable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$(expectedSelector).focus().on('blur', () => {
      assert.ok(1, 'blurred');
      assert.equal(document.activeElement, document.body);
    });

    await this.adapter.await(page.foo());
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: blurrable('input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input/></div>');

    this.adapter.$('.scope input').focus().on('blur', () => assert.ok(1));
    await this.adapter.await(page.foo());
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: blurrable('input')
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input /></div>');

    this.adapter.$('.scope input').focus().on('blur', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('resets scope', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: blurrable('input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, '<input/>');

    this.adapter.$('input').focus().on('blur', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: blurrable('input')
    });

    await this.adapter.createTemplate(this, page, '<input/>');

    this.adapter.$('input').focus();

    assert.ok(page.foo);
  });

  test('finds element by index', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: blurrable('input', { at: 3 })
    });

    await this.adapter.createTemplate(this, page, '<input /><input /><input /><input />');

    this.adapter.$(expectedSelector).focus().on('blur', () => assert.ok(1));
    await this.adapter.await(page.foo());
  });

  test('looks for elements outside the testing container', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      foo: blurrable('input', { testContainer: expectedContext })
    });

    await this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).focus().on('blur', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      testContainer: expectedContext,
      foo: blurrable('input')
    });

    await this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).focus().on('blur', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: blurrable('button')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });

  if (adapter === 'integration' || adapter === 'acceptance') {
    test('Does not raise error when blurring focusable elements', async function(assert) {
      assert.expect(0);

      let page = create({
        foo: {
          bar: {
            input: blurrable('input'),
            select: blurrable('select'),
            a: blurrable('a'),
            area: blurrable('area'),
            iframe: blurrable('iframe'),
            button: blurrable('button'),
            contentEditable: blurrable('[contenteditable]'),
            tabindex: blurrable('[tabindex]'),

          }
        }
      });

      await this.adapter.createTemplate(this, page, `
        <input/>
        <a href="foo"></a>
        <area href="foo"></a>
        <iframe></iframe>
        <select></select>
        <button></button>
        <div contenteditable></div>
        <div tabindex=-1></div>
      `);


      page.foo.bar.input();
      page.foo.bar.select();
      page.foo.bar.a();
      page.foo.bar.area();
      page.foo.bar.iframe();
      page.foo.bar.button()
      page.foo.bar.contentEditable();
      page.foo.bar.tabindex();
    });
  }

  test('raises an error when the element is not focusable', async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: blurrable('span'),
          qux: blurrable('input'),
          quux: blurrable('button'),
          quuz: blurrable('[contenteditable]')
        }
      }
    });

    await this.adapter.createTemplate(this, page, `
      <span></span>
      <input disabled=true/>
      <button style="display: none;"></button>
      <div contenteditable="false"></div>
    `);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz();
    }, /page\.foo\.bar\.baz/, 'Element is not focusable because it is not a link');

    if (adapter === 'acceptance' || adapter === 'integration') {
      await this.adapter.throws(assert, function() {
        return page.foo.bar.qux();
      }, /page\.foo\.bar\.qux/, 'Element is not focusable because it is disabled');

      await this.adapter.throws(assert, function() {
        return page.foo.bar.quux();
      }, /page\.foo\.bar\.quux/, 'Element is not focusable because it is hidden');
    }

    await this.adapter.throws(assert, function() {
      return page.foo.bar.quuz();
    }, /page\.foo\.bar\.quuz/, 'Element is not focusable because it is contenteditable="false"');
  });
});
