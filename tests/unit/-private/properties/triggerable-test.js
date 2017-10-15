import { moduleForProperty } from '../../../helpers/properties';
import { create, triggerable } from 'ember-cli-page-object';

moduleForProperty('triggerable', function(test) {
  test("calls Ember's triggerEvent helper with proper args", function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let page = create({
      foo: triggerable('focus', expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<input />');

    return this.adapter.andThen(() => {
      this.adapter.$(expectedSelector).on('focus', () => {
        assert.ok(1);
      });
      page.foo();

      return this.adapter.wait();
    });
  });

  test("calls Ember's triggerEvent helper with static event options", function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input', { eventProperties: { keyCode: 13 } })
    });

    this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$('input').on('keypress', (e) => assert.equal(e.keyCode, 13));

    page.foo();

    return this.adapter.wait();
  });

  test("calls Ember's triggerEvent helper with dynamic event options", function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input')
    });

    this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$('input').on('keypress', (e) => assert.equal(e.keyCode, 13));

    page.foo({ keyCode: 13 });

    return this.adapter.wait();
  });

  test("overrides static event options with dynamic event options", function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input', {
        eventProperties: { keyCode: 0 }
      })
    });

    this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$('input').on('keypress', (e) => assert.equal(e.keyCode, 13));

    page.foo({ keyCode: 13 });

    return this.adapter.wait();
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input/></div>');

    this.adapter.$('.scope input').on('focus', () => assert.ok(1));
    page.foo();

    return this.adapter.wait();
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: triggerable('focus', 'input')
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input /></div>');

    this.adapter.$('.scope input').on('focus', () => assert.ok(1));

    page.foo();

    return this.adapter.wait();
  });

  test('resets scope', function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: triggerable('focus', 'input', { resetScope: true })
    });

    this.adapter.createTemplate(this, page, '<input></input>');

    this.adapter.$('input').on('focus', () => assert.ok(1));

    page.foo();

    return this.adapter.wait();
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input')
    });

    this.adapter.createTemplate(this, page, '<input/>');

    assert.equal(page.foo(), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: triggerable('focus', 'input', { at: 3 })
    });

    this.adapter.createTemplate(this, page, '<input /><input /><input /><input />');

    this.adapter.$(expectedSelector).on('focus', () => assert.ok(1));
    page.foo();

    return this.adapter.wait();
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      foo: triggerable('focus', 'input', { testContainer: expectedContext })
    });

    this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).on('focus', () => assert.ok(1));

    page.foo();

    return this.adapter.wait();
  });

  test('looks for elements within test container specified at node level', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      testContainer: expectedContext,
      foo: triggerable('focus', 'input')
    });

    this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).on('focus', () => assert.ok(1));

    page.foo();

    return this.adapter.wait();
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
