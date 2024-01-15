import { create, isPresent } from 'ember-cli-page-object';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';

module('isPresent', function (hooks) {
  setupRenderingTest(hooks);

  test('returns true when the element is visible', async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('span'),
    });

    await this.createTemplate('Lorem <span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('returns true when the element is hidden', async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('span'),
    });

    await this.createTemplate('Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.foo);
  });

  test("returns false when the element doesn't exist", async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('span'),
    });

    await this.createTemplate('');

    assert.ok(!page.foo);
  });

  test('looks for elements inside the scope', async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('span', { scope: '.scope', at: 0 }),
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: isPresent('span', { at: 0 }),
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: isPresent('span', { resetScope: true, at: 0 }),
    });

    await this.createTemplate(`
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('span'),
    });

    await this.createTemplate(`
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.throws(
      () => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./
    );
  });

  test('finds element by index', async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('em', { at: 0 }),
      bar: isPresent('em', { at: 2 }),
    });

    await this.createTemplate(`
      <em>lorem</em>
      <em>ipsum</em>
    `);

    assert.ok(page.foo);
    assert.ok(!page.bar);
  });

  test('looks for elements outside the testing container', async function (this: TestContext, assert) {
    const page = create({
      foo: isPresent('span', { testContainer: '#alternate-ember-testing' }),
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    await this.createTemplate('<span>ipsum</span>', {
      useAlternateContainer: true,
    });
    await this.createTemplate('<span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', async function (this: TestContext, assert) {
    const page = create({
      testContainer: '#alternate-ember-testing',
      foo: isPresent('span'),
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    await this.createTemplate('<span>ipsum</span>', {
      useAlternateContainer: true,
    });
    await this.createTemplate('<span>ipsum</span>');

    assert.ok(page.foo);
  });
});
