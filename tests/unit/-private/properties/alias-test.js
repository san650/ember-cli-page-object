import { moduleForProperty } from '../../../helpers/properties';
import {
  create,
  clickable,
  collection,
  isVisible,
  text
} from 'ember-cli-page-object';
import {
  alias,
  getter
} from 'ember-cli-page-object/macros';

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

  test('can alias a top-level collection', function(assert) {
    assert.expect(1);

    const page = create({
      foo: collection({
        itemScope: 'button'
      }),
      fooCollection: alias('foo')
    });

    this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.fooCollection().count, 2);
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

  test('can alias a nested collection', function(assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: collection({
          itemScope: 'button'
        })
      },
      fooBarCollection: alias('foo.bar')
    });

    this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.fooBarCollection().count, 2);
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

  test('can alias an aliased collection', function(assert) {
    assert.expect(1);

    const page = create({
      foo: {
        bar: {
          baz: collection({
            itemScope: 'button'
          })
        },
        barBazCollection: alias('bar.baz')
      },
      fooBarBazCollection: alias('foo.barBazCollection')
    });

    this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.fooBarBazCollection().count, 2);
  });

  test('can alias a property created with the `getter` macro', function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        buttonText: text('button'),
        isButtonReady: getter(function() {
          return this.buttonText === 'Ready to Submit!';
        }),
      },
      aliasedIsButtonReady: alias('form.isButtonReady')
    });

    this.adapter.createTemplate(this, page, '<button>Ready to Submit!</button>');

    assert.ok(page.aliasedIsButtonReady);
  });

  test('throws error if alias targets nonexistent top-level property', function(assert) {
    assert.expect(1);

    const page = create({
      fooAlias: alias('foo')
    });

    assert.throws(
      function() { return page.fooAlias; },
      /PageObject does not contain aliased property `foo`/,
      'Aliased property not found'
    );
  });

  test('throws error if alias targets nonexistent nested property', function(assert) {
    assert.expect(1);

    const page = create({
      fooBarAlias: alias('foo.bar')
    });

    assert.throws(
      function() { return page.fooBarAlias; },
      /PageObject does not contain aliased property `foo.bar`/,
      'Aliased property not found'
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
