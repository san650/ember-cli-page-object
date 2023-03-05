import { setupRenderingTest, TestContext } from '../../../helpers';
import { create, hasClass } from 'ember-cli-page-object';
import { module, test } from 'qunit';

module('hasClass', function(hooks) {
  setupRenderingTest(hooks);

  test('returns true when the element has the class', async function(this: TestContext, assert) {
    let page = create({
      foo: hasClass('ipsum', 'span')
    });

    await this.createTemplate('<em class="lorem"></em><span class="ipsum"></span>');

    assert.ok(page.foo);
  });

  test('returns false when the element doesn\'t have the class', async function(this: TestContext, assert) {
    let page = create({
      foo: hasClass('lorem', 'span')
    });

    await this.createTemplate('<em class="lorem"></em><span class="ipsum"></span>');

    assert.ok(!page.foo);
  });

  test("raises an error when the element doesn't exist", async function(this: TestContext, assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: hasClass('lorem', 'span')
          }
        }
      }
    });

    await this.createTemplate('');

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(this: TestContext, assert) {
    let page = create({
      foo: hasClass('ipsum', 'span', { scope: '.scope' })
    });

    await this.createTemplate(`
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: hasClass('ipsum', 'span')
    });

    await this.createTemplate(`
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function(this: TestContext, assert) {
    let page = create({
      scope: '.scope',

      foo: hasClass('lorem', '.foo span', { resetScope: true })
    });

    await this.createTemplate(`
      <div class="foo">
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', async function(this: TestContext, assert) {
    let page = create({
      foo: hasClass('lorem', 'span')
    });

    await this.createTemplate(`
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('finds element by index', async function(this: TestContext, assert) {
    let page = create({
      foo: hasClass('ipsum', 'span', { at: 1 })
    });

    await this.createTemplate(`
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', async function(this: TestContext, assert) {
    let page = create({
      foo: hasClass('lorem', 'span', { testContainer: '#alternate-ember-testing' })
    });

    await this.createTemplate('<span class="lorem"></span>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', async function(this: TestContext, assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: hasClass('lorem', 'span')
    });

    await this.createTemplate('<span class="lorem"></span>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });
});
