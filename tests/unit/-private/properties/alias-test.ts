import { setupTestModuleForProperty } from '../../../helpers/properties';
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

setupTestModuleForProperty('alias', function(test) {
  test('can alias a top-level property', async function(assert) {
    assert.expect(1);

    const page = create({
      isButtonVisible: isVisible('button'),
      aliasedIsButtonVisible: alias('isButtonVisible')
    });

    await this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias a top-level method', async function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      clickButton: clickable(expectedSelector),
      aliasedClickButton: alias('clickButton')
    });

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.$('button').on('click', function() {
      assert.ok(true);
    });

    await this.adapter.await(page.aliasedClickButton());
  });

  test('returns chainable object from top-level method', async function(assert) {
    assert.expect(1);

    const page = create({
      clickButton: clickable('button'),
      aliasedClickButton: alias('clickButton', { chainable: true })
    });

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    let ret = page.aliasedClickButton();
    assert.ok(ret.clickButton);

    await this.adapter.await(ret);
  });

  test('can alias a top-level collection', async function(assert) {
    const page = create({
      buttons: collection('button'),
      aliasedButtons: alias('buttons')
    });

    await this.adapter.createTemplate(this, page, `
      <button>Button 1</button>
      <button>Button 2</button>
    `);

    assert.equal(page.aliasedButtons.length, 2);
  });

  test('can alias a nested property', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        button: {
          scope: 'button'
        }
      },
      aliasedIsButtonVisible: alias('form.button.isVisible')
    });

    await this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias a nested method', async function(assert) {
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

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.$('button').on('click', function() {
      assert.ok(true);
    });

    await this.adapter.await(page.aliasedClickButton());
  });

  test('returns chainable object from nested method', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        button: {
          scope: 'button'
        }
      },
      aliasedClickButton: alias('form.button.click', { chainable: true })
    });

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    let ret = page.aliasedClickButton();
    assert.ok(ret.form.button);

    await this.adapter.await(ret);
  });

  test('can alias a nested collection', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        buttons: collection('button')
      },
      aliasedButtons: alias('form.buttons')
    });

    await this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.aliasedButtons.length, 2);
  });

  test('can alias an aliased property', async function(assert) {
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

    await this.adapter.createTemplate(this, page, '<button>Look at me</button>');

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias an aliased method', async function(assert) {
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

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    this.adapter.$('button').on('click', function() {
      assert.ok(true);
    });

    await this.adapter.await(page.aliasedClickButton());
  });

  test('returns chainable object from aliased method', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        button: {
          scope: 'button'
        },
        clickButton: alias('button.click')
      },
      aliasedClickButton: alias('form.clickButton', { chainable: true })
    });

    await this.adapter.createTemplate(this, page, '<button>Click me</button>');

    let ret = page.aliasedClickButton();
    assert.ok(ret.form.button);

    await this.adapter.await(ret);
  });

  test('can alias an aliased collection', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        controls: {
          buttons: collection('button')
        },
        buttons: alias('controls.buttons')
      },
      aliasedButtons: alias('form.buttons')
    });

    await this.adapter.createTemplate(
      this,
      page,
      '<button>Button 1</button><button>Button 2</button>'
    );

    assert.equal(page.aliasedButtons.length, 2);
  });

  test('can alias a property created with the `getter` macro', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        buttonText: text('button'),
        isButtonReady: getter(function(this: any) {
          return this.buttonText === 'Ready to Submit!';
        }),
      },
      aliasedIsButtonReady: alias('form.isButtonReady')
    });

    await this.adapter.createTemplate(this, page, '<button>Ready to Submit!</button>');

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

  test('does not throw error if alias targets top-level property with falsy value', async function(assert) {
    assert.expect(1);

    const page = create({
      isButtonVisible: isVisible('button'),
      aliasedIsButtonVisible: alias('isButtonVisible')
    });

    await this.adapter.createTemplate(this, page, '<span>No button here</span>');

    assert.equal(page.aliasedIsButtonVisible, false);
  });

  test('does not throw error if alias targets nested property with falsy value', async function(assert) {
    assert.expect(1);

    const page = create({
      button: {
        scope: 'button'
      },
      aliasedIsButtonVisible: alias('button.isVisible')
    });

    await this.adapter.createTemplate(this, page, '<span>No button here</span>');

    assert.equal(page.aliasedIsButtonVisible, false);
  });
});
