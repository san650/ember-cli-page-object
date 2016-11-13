import { moduleForProperty } from '../helpers/properties';
import { create, contains } from 'ember-cli-page-object';

moduleForProperty('contains', function(test) {
  test('returns true when the element contains the text', function(assert) {
    let page = create({
      foo: contains('span')
    });

    this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(!page.foo('Not here'));
    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: contains('span', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.ok(!page.foo('lorem'));
    assert.ok(page.foo('ipsum'));
  });

  test("looks for elements inside page's scope", function(assert) {
    let page = create({
      scope: '.scope',

      foo: contains('span')
    });

    this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.ok(!page.foo('lorem'));
    assert.ok(page.foo('ipsum'));
  });

  test("raises an error when the element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: contains('.element')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux('baz'), /page\.foo\.bar\.baz\.qux/);
  });

  test('resets scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: contains('span', { at: 0, resetScope: true })
    });

    this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
      <div><span>dolor</span></div>
    `);

    assert.ok(page.foo('lorem'));
  });

  test('throws error if selector matches more than one element', function(assert) {
    let page = create({
      foo: contains('span')
    });

    this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span>lorem</span>
      <span>lorem</span>
    `);

    assert.throws(() => page.foo('lorem'),
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements with multiple: true option, returns false if not all elements contain text', function(assert) {
    let page = create({
      foo: contains('span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span>ipsum</span>
      <span>dolor</span>
    `);

    assert.ok(!page.foo('lorem'));
  });

  test('matches multiple elements with multiple: true option, returns true if all elements contain text', function(assert) {
    let page = create({
      foo: contains('span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span>lorem</span>
    `);

    assert.ok(page.foo('lorem'));
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: contains('span', { at: 1 })
    });

    this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span>ipsum</span>
      <span>dolor</span>
    `);

    assert.ok(!page.foo('lorem'));
    assert.ok(page.foo('ipsum'));
  });

  test('looks for elements outside the testing container', function(assert) {
    let page = create({
      foo: contains('span', { testContainer: '#alternate-ember-testing' })
    });

    this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>', { useAlternateContainer: true });

    assert.ok(page.foo('ipsum'));
  });
});
