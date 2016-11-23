import { moduleForProperty } from '../helpers/properties';
import { create, notHasClass } from 'ember-cli-page-object';

moduleForProperty('notHasClass', function(test) {
  test('returns false when the element has the class', function(assert) {
    let page = create({
      foo: notHasClass('ipsum', '.lorem')
    });

    this.adapter.createTemplate(this, page, '<span class="lorem ipsum"></span>');

    assert.ok(!page.foo);
  });

  test('returns true when the element doesn\'t have the class', function(assert) {
    let page = create({
      foo: notHasClass('ipsum', '.lorem')
    });

    this.adapter.createTemplate(this, page, '<span class="lorem"></span>');

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: notHasClass('has-error', '.element')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", function(assert) {
    let page = create({
      scope: '.scope',

      foo: notHasClass('lorem', 'span')
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: notHasClass('ipsum', 'span', { resetScope: true, at: 0 })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span class="lorem"></span>
      </div>
      <div class="scope">
        <span class="ipsum"></span>
      </div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span')
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements with multiple: true option, returns true if no elements have class', function(assert) {
    let page = create({
      foo: notHasClass('other-class', 'span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(page.foo);
  });

  test('matches multiple elements with multiple: true option, returns false if some elements have class', function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(!page.foo);
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: notHasClass('lorem', 'span', { at: 1 })
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', function(assert) {
    let page = create({
      foo: notHasClass('ipsum', '.lorem', { testContainer: '#alternate-ember-testing' })
    });

    this.adapter.createTemplate(this, page, '<span class="lorem ipsum"></span>', { useAlternateContainer: true });

    assert.ok(!page.foo);
  });

  test('looks for elements within test container specified at node level', function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: notHasClass('ipsum', '.lorem')
    });

    this.adapter.createTemplate(this, page, '<span class="lorem ipsum"></span>', { useAlternateContainer: true });

    assert.ok(!page.foo);
  });
});
