import { moduleForProperty } from '../helpers/properties';
import { create, hasClass } from 'ember-cli-page-object';

moduleForProperty('hasClass', function(test) {
  test('returns true when the element has the class', function(assert) {
    let page = create({
      foo: hasClass('ipsum', 'span')
    });

    this.adapter.createTemplate(this, page, '<em class="lorem"></em><span class="ipsum"></span>');

    assert.ok(page.foo);
  });

  test('returns false when the element doesn\'t have the class', function(assert) {
    let page = create({
      foo: hasClass('lorem', 'span')
    });

    this.adapter.createTemplate(this, page, '<em class="lorem"></em><span class="ipsum"></span>');

    assert.ok(!page.foo);
  });

  test("raises an error when the element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: hasClass('lorem', 'span')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: hasClass('ipsum', 'span', { scope: '.scope' })
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

      foo: hasClass('ipsum', 'span')
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

      foo: hasClass('lorem', 'div:first span', { resetScope: true })
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
      foo: hasClass('lorem', 'span')
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements with multiple: true option returns false if not all elements have class', function(assert) {
    let page = create({
      foo: hasClass('lorem', 'span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(!page.foo);
  });

  test('matches multiple elements with multiple: true option returns true if all elements have class', function(assert) {
    let page = create({
      foo: hasClass('lorem', 'span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.ok(page.foo);
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: hasClass('ipsum', 'span', { at: 1 })
    });

    this.adapter.createTemplate(this, page, `
      <span class="lorem"></span>
      <span class="ipsum"></span>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', function(assert) {
    let page = create({
      foo: hasClass('lorem', 'span', { testContainer: '#alternate-ember-testing' })
    });

    this.adapter.createTemplate(this, page, '<span class="lorem"></span>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: hasClass('lorem', 'span')
    });

    this.adapter.createTemplate(this, page, '<span class="lorem"></span>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });
});
