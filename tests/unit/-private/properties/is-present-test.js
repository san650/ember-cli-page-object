import { moduleForProperty } from '../../../helpers/properties';
import { create, isPresent } from 'ember-cli-page-object';

moduleForProperty('isPresent', function(test) {
  test('returns true when the element is visible', function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('returns true when the element is hidden', function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    this.adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.foo);
  });

  test('returns false when the element doesn\'t exist', function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    this.adapter.createTemplate(this, page);

    assert.ok(!page.foo);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: isPresent('span', { scope: '.scope', at: 0 })
    });

    this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", function(assert) {
    let page = create({
      scope: '.scope',

      foo: isPresent('span', { at: 0 })
    });

    this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: isPresent('span', { resetScope: true, at: 0 })
    });

    this.adapter.createTemplate(this, page, `
      <div><span>lorem</span></div>
      <div class="scope"><span>ipsum</span></div>
    `);

    assert.ok(page.foo);
  });

  test('throws error if selector matches more than one element', function(assert) {
    let page = create({
      foo: isPresent('span')
    });

    this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements with multiple: true option', function(assert) {
    let page = create({
      foo: isPresent('span', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <span>lorem</span>
      <span> ipsum </span>
      <span>dolor</span>
    `);

    assert.ok(page.foo);
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: isPresent('em', { at: 0 }),
      bar: isPresent('em', { at: 2 })
    });

    this.adapter.createTemplate(this, page, `
      <em>lorem</em>
      <em>ipsum</em>
    `);

    assert.ok(page.foo);
    assert.ok(!page.bar);
  });

  test('looks for elements outside the testing container', function(assert) {
    let page = create({
      foo: isPresent('span', { testContainer: '#alternate-ember-testing' })
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    this.adapter.createTemplate(this, page, '<span>ipsum</span>', { useAlternateContainer: true });
    this.adapter.createTemplate(this, page, '<span>ipsum</span>');

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: isPresent('span')
    });

    // FIXME the order we call createTemplate here is important! (it shouldn't, that's why there's a FIXME tag)
    this.adapter.createTemplate(this, page, '<span>ipsum</span>', { useAlternateContainer: true });
    this.adapter.createTemplate(this, page, '<span>ipsum</span>');

    assert.ok(page.foo);
  });
});
