import { moduleForProperty } from '../helpers/properties';
import { create, alias, clickable, isVisible } from 'ember-cli-page-object';

moduleForProperty('alias', function(test) {
  test('can alias a top-level property', function(assert) {
    assert.expect(1);

    const page = create({
      foo: isVisible('button'),
      fooAlias: alias('foo')
    });

    this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.fooAlias);
  });

  test('can alias a top-level method', function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      foo: clickable(expectedSelector),
      fooAlias: alias('foo')
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.fooAlias();

    return this.adapter.wait();
  });

  test('can alias a nested property', function(assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          scope: 'button'
        }
      },
      isFooBarVisible: alias('foo.bar.isVisible')
    });

    this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.isFooBarVisible);
  });

  test('can alias a nested method', function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      foo: {
        bar: {
          scope: expectedSelector
        }
      },
      clickFooBar: alias('foo.bar.click')
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.clickFooBar();

    return this.adapter.wait();
  });

  test('can alias an aliased property', function(assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          scope: 'button'
        },
        isBarVisible: alias('bar.isVisible')
      },
      isFooBarVisible: alias('foo.isBarVisible')
    });

    this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.isFooBarVisible);
  });

  test('can alias an aliased method', function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      foo: {
        bar: {
          scope: expectedSelector
        },
        clickBar: alias('bar.click')
      },
      clickFooBar: alias('foo.clickBar')
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.clickFooBar();

    return this.adapter.wait();
  });

  test('throws error if alias targets nonexistent top-level property', function(assert) {
    assert.expect(1);

    const page = create({
      fooAlias: alias('foo')
    });

    assert.throws(
      function() { return page.fooAlias; },
      '`fooAlias`: aliased property `foo` is not defined.'
    );
  });

  test('throws error if alias targets nonexistent nested property', function(assert) {
    assert.expect(1);

    const page = create({
      fooBarAlias: alias('foo.bar')
    });

    assert.throws(
      function() { return page.fooBarAlias; },
      '`fooBarAlias`: aliased property `foo.bar` is not defined.'
    );
  });

  test('does not throw error if alias targets top-level property with falsy value', function(assert) {
    assert.expect(1);

    const page = create({
      foo: isVisible('button'),
      fooAlias: alias('foo')
    });

    this.adapter.createTemplate(this, page, '<span>No button here</span>');

    assert.equal(page.fooAlias, false);
  });

  test('does not throw error if alias targets nested property with falsy value', function(assert) {
    assert.expect(1);

    const page = create({
      foo: {
        scope: 'button'
      },
      isFooVisible: alias('foo.isVisible')
    });

    this.adapter.createTemplate(this, page, '<span>No button here</span>');

    assert.equal(page.isFooVisible, false);
  });
});
