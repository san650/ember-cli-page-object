import { moduleForProperty } from '../../../helpers/properties';
import { create, triggerable } from 'ember-cli-page-object';

moduleForProperty('triggerable', function(test) {
  test("calls Ember's triggerEvent helper with proper args", async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let page = create({
      foo: triggerable('focus', expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$(expectedSelector).on('focus', () => {
      assert.ok(1);
    });

    await this.adapter.await(page.foo());
  });

  test("calls Ember's triggerEvent helper with static event options", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input', { eventProperties: { keyCode: 13 } })
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$('input').on('keypress', (e) => assert.equal(e.keyCode, 13));

    await this.adapter.await(page.foo());
  });

  test("calls Ember's triggerEvent helper with dynamic event options", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input')
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$('input').on('keypress', (e) => assert.equal(e.keyCode, 13));

    await this.adapter.await(page.foo({ keyCode: 13 }));
  });

  test("overrides static event options with dynamic event options", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input', {
        eventProperties: { keyCode: 0 }
      })
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$('input').on('keypress', (e) => assert.equal(e.keyCode, 13));

    await this.adapter.await(page.foo({ keyCode: 13 }));
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input/></div>');

    this.adapter.$('.scope input').on('focus', () => assert.ok(1));
    await this.adapter.await(page.foo());
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: triggerable('focus', 'input')
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input /></div>');

    this.adapter.$('.scope input').on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('resets scope', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: triggerable('focus', 'input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, '<input></input>');

    this.adapter.$('input').on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input')
    });

    await this.adapter.createTemplate(this, page, '<input/>');

    let ret = page.foo();
    assert.ok(ret.foo);
    await this.adapter.await(ret);
  });

  test('finds element by index', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: triggerable('focus', 'input', { at: 3 })
    });

    await this.adapter.createTemplate(this, page, '<input /><input /><input /><input />');

    this.adapter.$(expectedSelector).on('focus', () => assert.ok(1));
    await this.adapter.await(page.foo());
  });

  test('looks for elements outside the testing container', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      foo: triggerable('focus', 'input', { testContainer: expectedContext })
    });

    await this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      testContainer: expectedContext,
      foo: triggerable('focus', 'input')
    });

    await this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test("raises an error when the element doesn't exist", async function(assert) {
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

    await this.adapter.createTemplate(this, page);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });
});
