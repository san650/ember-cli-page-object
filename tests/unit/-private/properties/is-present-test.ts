import { moduleForProperty } from '../../../helpers/properties';
import { create, isPresent } from 'ember-cli-page-object';

moduleForProperty('isPresent', function(test) {
  test('returns true when the element is visible', async function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('returns true when the element is hidden', async function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.foo);
  });

  test('returns false when the element doesn\'t exist', async function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    await this.adapter.createTemplate(this, page);

    assert.ok(!page.foo);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: isPresent('span', { scope: '.scope', at: 0 })
    });

    await this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: isPresent('span', { at: 0 })
    });

    await this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: isPresent('span', { resetScope: true, at: 0 })
    });

    await this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    await this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: isPresent('em', { at: 0 }),
      bar: isPresent('em', { at: 2 })
    });

    await this.adapter.createTemplate(this, page, `
      <em>lorem</em>
      <em>ipsum</em>
    `);

    assert.ok(page.foo);
    assert.ok(!page.bar);
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: isPresent('span', { testContainer: '#alternate-ember-testing' })
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    await this.adapter.createTemplate(this, page, '<span>ipsum</span>', { useAlternateContainer: true });
    await this.adapter.createTemplate(this, page, '<span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: isPresent('span')
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    await this.adapter.createTemplate(this, page, '<span>ipsum</span>', { useAlternateContainer: true });
    await this.adapter.createTemplate(this, page, '<span>ipsum</span>');

    assert.ok(page.foo);
  });
});
