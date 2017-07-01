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
      isButtonVisible: isVisible('button'),
      aliasedIsButtonVisible: alias('isButtonVisible')
    });

    this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias a top-level method', function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      clickButton: clickable(expectedSelector),
      aliasedClickButton: alias('clickButton')
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.aliasedClickButton();

    return this.adapter.wait();
  });

  test('can alias a top-level collection', function(assert) {
    assert.expect(1);

    const page = create({
      buttons: collection({
        itemScope: 'button'
      }),
      aliasedButtons: alias('buttons')
    });

    this.adapter.createTemplate(this, page, `
      <button>Button 1</button>
      <button>Button 2</button>
    `);

    assert.equal(page.aliasedButtons().count, 2);
  });

  test('can alias a nested property', function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        button: {
          scope: 'button'
        }
      },
      aliasedIsButtonVisible: alias('form.button.isVisible')
    });

    this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias a nested method', function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      form: {
        button: {
          scope: expectedSelector
        }
      },
      aliasedClickButton: alias('form.button.click')
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.aliasedClickButton();

    return this.adapter.wait();
  });

  test('can alias a nested collection', function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        buttons: collection({
          itemScope: 'button'
        })
      },
      aliasedButtons: alias('form.buttons')
    });

    this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.aliasedButtons().count, 2);
  });

  test('can alias an aliased property', function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        button: {
          scope: 'button'
        },
        isButtonVisible: alias('button.isVisible')
      },
      aliasedIsButtonVisible: alias('form.isButtonVisible')
    });

    this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias an aliased method', function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      form: {
        button: {
          scope: expectedSelector
        },
        clickButton: alias('button.click')
      },
      aliasedClickButton: alias('form.clickButton')
    });

    this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.click((actualSelector) => {
      assert.equal(actualSelector, expectedSelector);
    });

    page.aliasedClickButton();

    return this.adapter.wait();
  });

  test('can alias an aliased collection', function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        controls: {
          buttons: collection({
            itemScope: 'button'
          })
        },
        buttons: alias('controls.buttons')
      },
      aliasedButtons: alias('form.buttons')
    });

    this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.aliasedButtons().count, 2);
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
      isButtonVisible: isVisible('button'),
      aliasedIsButtonVisible: alias('isButtonVisible')
    });

    this.adapter.createTemplate(this, page, '<span>No button here</span>');

    assert.equal(page.aliasedIsButtonVisible, false);
  });

  test('does not throw error if alias targets nested property with falsy value', function(assert) {
    assert.expect(1);

    const page = create({
      button: {
        scope: 'button'
      },
      aliasedIsButtonVisible: alias('button.isVisible')
    });

    this.adapter.createTemplate(this, page, '<span>No button here</span>');

    assert.equal(page.aliasedIsButtonVisible, false);
  });
});
