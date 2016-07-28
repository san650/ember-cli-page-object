import { moduleForProperty } from '../helpers/properties';
import { create, isVisible } from 'ember-cli-page-object';

moduleForProperty('isVisible', function(test, adapter) {
  test('returns true when the element is visible', function(assert) {
    let page = create({
      foo: isVisible('span')
    });

    adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('returns false when the element is hidden', function(assert) {
    let page = create({
      foo: isVisible('span')
    });

    adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(!page.foo);
  });

  test('returns false when the element doesn\'t exist', function(assert) {
    let page = create({
      foo: isVisible('span')
    });

    adapter.createTemplate(this, page);

    assert.ok(!page.foo);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: isVisible('span', { scope: '.scope', at: 0 })
    });

    adapter.createTemplate(this, page, `
      <div><span style="display:none">lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", function(assert) {
    let page = create({
      scope: '.scope',

      foo: isVisible('span', { at: 0 })
    });

    adapter.createTemplate(this, page, `
      <div><span style="display:none">lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: isVisible('span', { resetScope: true, at: 0 })
    });

    adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span style="display:none">ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', function(assert) {
    let page = create({
      foo: isVisible('span')
    });

    adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements with multiple: true option, return false if not all elements are visible', function(assert) {
    let page = create({
      foo: isVisible('span', { multiple: true })
    });

    adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span style="display:none"> ipsum </span>
      <span>dolor</span>
    `);

    assert.ok(!page.foo);
  });

  test('matches multiple elements with multiple: true option, return true if all elements are visible', function(assert) {
    let page = create({
      foo: isVisible('span', { multiple: true })
    });

    adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span>dolor</span>
    `);

    assert.ok(page.foo);
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: isVisible('em', { at: 0 }),
      bar: isVisible('em', { at: 2 })
    });

    adapter.createTemplate(this, page, `
      <em style="display:none">lorem</em>
      <em style="display:none">ipsum</em>
      <em>dolor</em>
    `);

    assert.ok(!page.foo);
    assert.ok(page.bar);
  });

  test('looks for elements outside the testing container', function(assert) {
    let page = create({
      foo: isVisible('span', { testContainer: '#alternate-ember-testing' })
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    adapter.createTemplate(this, page, '<span>ipsum</span>', { useAlternateContainer: true });
    adapter.createTemplate(this, page, '<span style="display:none">ipsum</span>');

    assert.ok(page.foo);
  });
});
