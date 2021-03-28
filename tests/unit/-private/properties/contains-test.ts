import { setupRenderingTest, TestContext } from '../../../helpers';
import { create, contains } from 'ember-cli-page-object';
import { module, test } from 'qunit';

module('contains', function(hooks) {
  setupRenderingTest(hooks);

  test('returns true when the element contains the text', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span')
    });

    await this.createTemplate('Lorem <span>ipsum</span>');

    assert.ok(!page.foo('Not here'));
    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements inside the scope', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span', { scope: '.scope' })
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.ok(!page.foo('lorem'));
    assert.ok(page.foo('ipsum'));
  });

  test("looks for elements inside page's scope", async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: contains('span')
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.ok(!page.foo('lorem'));
    assert.ok(page.foo('ipsum'));
  });

  test("raises an error when the element doesn't exist", async function(this: TestContext, assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: contains('.element')
          }
        }
      }
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux('baz'), /page\.foo\.bar\.baz\.qux/);
  });

  test('resets scope', async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: contains('span', { at: 0, resetScope: true })
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.ok(page.foo('lorem'));
  });

  test('throws error if selector matches more than one element', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span')
    });

    await this.createTemplate(`
      <span>lorem</span>
      <span>lorem</span>
      <span>lorem</span>
    `);

    assert.throws(() => page.foo('lorem'),
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('finds element by index', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span', { at: 1 })
    });

    await this.createTemplate(`
      <span>lorem</span>
      <span>ipsum</span>
      <span>dolor</span>
    `);

    assert.ok(!page.foo('lorem'));
    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements outside the testing container', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span', { testContainer: '#alternate-ember-testing' })
    });

    await this.createTemplate('Lorem <span>ipsum</span>', { useAlternateContainer: true });

    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements within test container specified at node level', async function(this: TestContext, assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: contains('span')
    });

    await this.createTemplate('Lorem <span>ipsum</span>', { useAlternateContainer: true });

    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements that are visibility hidden', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span')
    });

    await this.createTemplate('Lorem <span style="visibility: hidden;">ipsum</span>');

    assert.ok(!page.foo('Not here'));
    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements that are display none', async function(this: TestContext, assert) {
    let page = create({
      foo: contains('span')
    });

    await this.createTemplate('Lorem <span style="display: none;">ipsum</span>');

    assert.ok(!page.foo('Not here'));
    assert.ok(page.foo('ipsum'));
  });
});
