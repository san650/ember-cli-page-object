import { create, triggerable } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';

module('triggerable', function(hooks) {
  setupRenderingTest(hooks);

  test("calls Ember's triggerEvent helper with proper args", async function(this: TestContext, assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let page = create({
      foo: triggerable('focus', expectedSelector)
    });

    await this.createTemplate('<input />');

    find(expectedSelector)!.addEventListener('focus', () => {
      assert.ok(1);
    });

    await page.foo();
  });

  test("calls Ember's triggerEvent helper with static event options", async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input', { eventProperties: { keyCode: 13 } })
    });

    await this.createTemplate('<input />');

    find('input')!.addEventListener('keypress', (e: KeyboardEvent) => assert.equal(e.keyCode, 13));

    await page.foo();
  });

  test("calls Ember's triggerEvent helper with dynamic event options", async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input')
    });

    await this.createTemplate('<input />');

    find('input')!.addEventListener('keypress', (e: KeyboardEvent) => assert.equal(e.keyCode, 13));

    await page.foo({ keyCode: 13 });
  });

  test("overrides static event options with dynamic event options", async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('keypress', 'input', {
        eventProperties: { keyCode: 0 }
      })
    });

    await this.createTemplate('<input />');

    find('input')!.addEventListener('keypress', (e: KeyboardEvent) => assert.equal(e.keyCode, 13));

    await page.foo({ keyCode: 13 });
  });

  test('looks for elements inside the scope', async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input', { scope: '.scope' })
    });

    await this.createTemplate('<div class="scope"><input/></div>');

    find('.scope input')!.addEventListener('focus', () => assert.ok(1));
    await page.foo();
  });

  test("looks for elements inside page's scope", async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: triggerable('focus', 'input')
    });

    await this.createTemplate('<div class="scope"><input /></div>');

    find('.scope input')!.addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test('resets scope', async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: triggerable('focus', 'input', { resetScope: true })
    });

    await this.createTemplate('<input></input>');

    find('input')!.addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test('returns chainable object', async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input')
    });

    await this.createTemplate('<input/>');

    let ret = page.foo();
    assert.ok(ret.foo);
    await ret;
  });

  test('finds element by index', async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input', { at: 3 })
    });

    await this.createTemplate('<input /><input /><input /><input />');

    find('input:nth-of-type(4)')!.addEventListener('focus', () => assert.ok(1));
    await page.foo();
  });

  test('looks for elements outside the testing container', async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      foo: triggerable('focus', 'input', { testContainer: '#alternate-ember-testing' })
    });

    await this.createTemplate('<input />', { useAlternateContainer: true });

    document.querySelector('#alternate-ember-testing input')!.addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test('looks for elements within test container specified at node level', async function(this: TestContext, assert) {
    assert.expect(1);

    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: triggerable('focus', 'input')
    });

    await this.createTemplate('<input />', { useAlternateContainer: true });

    document.querySelector('#alternate-ember-testing input')!.addEventListener('focus', () => assert.ok(1));

    await page.foo();
  });

  test("raises an error when the element doesn't exist", async function(this: TestContext, assert) {
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

    await this.createTemplate('');

    await assert.throws(function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });
});
