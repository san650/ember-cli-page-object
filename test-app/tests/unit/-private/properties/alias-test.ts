import { setupRenderingTest } from '../../../helpers';
import {
  create,
  clickable,
  collection,
  isVisible,
  text
} from 'ember-cli-page-object';
import {
  alias,
  getter,
} from 'ember-cli-page-object/macros';
import { render, find, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('alias', function(hooks) {
  setupRenderingTest(hooks);

  test('can alias a top-level property', async function(assert) {
    assert.expect(1);

    const page = create({
      isButtonVisible: isVisible('button'),
      aliasedIsButtonVisible: alias('isButtonVisible')
    });

    await render(hbs`<button>Look at me</button>`);

    assert.ok(page.aliasedIsButtonVisible);
  });

  test('can alias a top-level method', async function(assert) {
    assert.expect(1);

    const expectedSelector = 'button';
    const page = create({
      clickButton: clickable(expectedSelector),
      aliasedClickButton: alias('clickButton')
    });

    await render(hbs`<button>Click me</button>`);

    find('button')!.addEventListener('click', function() {
      assert.ok(true);
    });

    await page.aliasedClickButton();

    await settled();
  });

  test('returns chainable object from top-level method', async function(assert) {
    assert.expect(1);

    const page = create({
      clickButton: clickable('button'),
      aliasedClickButton: alias('clickButton', { chainable: true })
    });

    await render(hbs`<button>Click me</button>`);

    let ret = page.aliasedClickButton();
    assert.ok(ret.clickButton);

    await settled()
  });

  test('can alias a top-level collection', async function(assert) {
    const page = create({
      buttons: collection('button'),
      aliasedButtons: alias('buttons')
    });

    await render(hbs`
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

    await render(hbs`<button>Look at me</button>`);

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

    await render(hbs`<button>Click me</button>`);

    find('button')?.addEventListener('click', function() {
      assert.ok(true);
    });

    await page.aliasedClickButton();
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

    await render(hbs`<button>Click me</button>`);

    let ret = page.aliasedClickButton();
    assert.ok(ret.form.button);

    await settled()
  });

  test('can alias a nested collection', async function(assert) {
    assert.expect(1);

    const page = create({
      form: {
        buttons: collection('button')
      },
      aliasedButtons: alias('form.buttons')
    });

    await render(hbs`<button>Button 1</button><button>Button 2</button>`);

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

    await render(hbs`<button>Look at me</button>`);

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

    await render(hbs`<button>Click me</button>`);

    find('button')!.addEventListener('click', function() {
      assert.ok(true);
    });

    await page.aliasedClickButton();
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

    await render(hbs`<button>Click me</button>`);

    let ret = page.aliasedClickButton();
    assert.ok(ret.form.button);

    await settled();
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

    await render(hbs`<button>Button 1</button><button>Button 2</button>`);

    assert.equal(page.aliasedButtons.length, 2);
  });

  test('can alias a property created with the `getter` macro', async function(assert) {
    assert.expect(1);

    type Getter<T> = ReturnType<typeof getter<Record<string, unknown>, T>>;

    type Form = {
      buttonText: Getter<string>,
      isButtonReady: Getter<boolean>
    }

    const form: Form = {
      buttonText: text('button'),
      isButtonReady: getter<Form>(function() {
        return this.buttonText === 'Ready to Submit!';
      }),
    };

    const page = create({
      form,
      aliasedIsButtonReady: alias('form.isButtonReady') as Form['isButtonReady']
    });

    await render(hbs`<button>Ready to Submit!</button>`);

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

    await render(hbs`<span>No button here</span>`);

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

    await render(hbs`<span>No button here</span>`);

    assert.equal(page.aliasedIsButtonVisible, false);
  });
});
