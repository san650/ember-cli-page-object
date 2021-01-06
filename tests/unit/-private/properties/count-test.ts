import { moduleForProperty } from '../../../helpers/properties';
import { create, count } from 'ember-cli-page-object';

moduleForProperty('count', function(test) {
  test('returns the number of elements that match the selector', async function(assert) {
    let page = create({
      foo: count('span')
    });

    await this.adapter.createTemplate(this, page, `
      <span></span>
      <span></span>
    `);

    assert.equal(page.foo, 2);
  });

  test('returns 0 when the no element is matched', async function(assert) {
    let page = create({
      foo: count('span')
    });

    await this.adapter.createTemplate(this, page);

    assert.equal(page.foo, 0);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: count('span', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div><span></span></div>
      <div class="scope"><span></span><span></span></div>
    `);

    assert.equal(page.foo, 2);
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: count('span')
    });

    await this.adapter.createTemplate(this, page, `
      <div><span></span></div>
      <div class="scope"><span></span><span></span></div>
    `);

    assert.equal(page.foo, 2);
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: count('span', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, `
      <div class="scope"></div>
      <div><span></span></div>
    `);

    assert.equal(page.foo, 1);
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: count('span', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<span></span><span></span>', { useAlternateContainer: true });

    assert.equal(page.foo, 2);
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: count('span')
    });

    await this.adapter.createTemplate(this, page, '<span></span><span></span>', { useAlternateContainer: true });

    assert.equal(page.foo, 2);
  });
});
