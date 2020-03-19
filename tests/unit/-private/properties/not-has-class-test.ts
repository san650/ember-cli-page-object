import { moduleForProperty } from '../../../helpers/properties';
import { create, notHasClass } from 'ember-cli-page-object';

moduleForProperty('notHasClass', function(test) {
  test('returns false when the element has the class', async function(assert) {
    let page = create({
      foo: notHasClass('ipsum', '.lorem')
    });

    await this.adapter.createTemplate(this, page, '<span class="lorem ipsum"></span>');

    assert.ok(!page.foo);
  });

  test('returns true when the element doesn\'t have the class', async function(assert) {
    let page = create({
      foo: notHasClass('ipsum', '.lorem')
    });

    await this.adapter.createTemplate(this, page, '<span class="lorem"></span>');

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: notHasClass('has-error', '.element')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', async function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, `
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", async function(assert) {
    let page = create({
      scope: '.scope',

      foo: notHasClass('lorem', 'span')
    });

    await this.adapter.createTemplate(this, page, `
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.scope',

      foo: notHasClass('ipsum', 'span', { resetScope: true, at: 0 })
    });

    await this.adapter.createTemplate(this, page, `
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', async function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span')
    });

    await this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If you want to select many elements, use collections instead./);
  });

  test('finds element by index', async function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span', { at: 1 })
    });

    await this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', async function(assert) {
    let page = create({
      foo: notHasClass('ipsum', '.lorem', { testContainer: '#alternate-ember-testing' })
    });

    await this.adapter.createTemplate(this, page, '<span class="lorem ipsum"></span>', { useAlternateContainer: true });

    assert.ok(!page.foo);
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: notHasClass('ipsum', '.lorem')
    });

    await this.adapter.createTemplate(this, page, '<span class="lorem ipsum"></span>', { useAlternateContainer: true });

    assert.ok(!page.foo);
  });
});
