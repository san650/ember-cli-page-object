import { moduleForProperty } from '../helpers/properties';
import { create } from 'ember-cli-page-object';

moduleForProperty('dsl', function(test, adapter) {
  test('generates .isVisible', function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.isVisible, 'page is visible');
    assert.ok(page.foo.isVisible, 'component is visible');
  });

  test('generates .isHidden', function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.isHidden, 'page is hidden');
    assert.ok(page.foo.isHidden, 'component is hidden');
  });

  ['isVisible', 'isHidden', 'clickOn', 'click', 'contains', 'text', 'fillIn', 'select', 'value'].forEach((prop) => {
    test(`does not override .${prop}`, function(assert) {
      let page = create({
        [prop]: 'foo bar'
      });

      adapter.createTemplate(this, page);

      assert.equal(page[prop], 'foo bar');
    });
  });

  test('generates .clickOn', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
      }
    });

    adapter.createTemplate(this, page, '<button>dummy text</button>');

    adapter.click(() => {
      assert.ok(true, 'click called');
    });

    page.foo.clickOn('dummy text');
  });

  test('generates .click', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button'
      }
    });

    adapter.createTemplate(this, page, '<button>dummy text</button>');

    adapter.click(() => {
      assert.ok(true, 'click called');
    });

    page.foo.click();
  });

  test('generates .contains', function(assert) {
    let page = create({
      foo: {
        scope: 'span'
      }
    });

    adapter.createTemplate(this, page, 'Ipsum <span>Dolor</span>');

    assert.ok(page.foo.contains('or'), 'contains');
  });

  test('generates .text', function(assert) {
    let page = create({
      scope: '.scope',
      foo: {
        scope: 'span'
      }
    });

    adapter.createTemplate(this, page, `
      <div>Lorem</div>
      <div class="scope">Ipsum <span>Dolor</span></div>
    `);

    assert.equal(page.text, 'Ipsum Dolor');
    assert.equal(page.foo.text, 'Dolor');
  });

  test('generates .fillIn', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    adapter.createTemplate(this, page, '<input name="email">');

    adapter.fillIn((selector, context, text) => {
      assert.equal(text, 'lorem ipsum');
    });

    page.foo.fillIn('lorem ipsum');
  });

  test('generates .select', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    adapter.createTemplate(this, page, '<input name="email">');

    adapter.fillIn((selector, context, text) => {
      assert.equal(text, 'lorem ipsum');
    });

    page.foo.select('lorem ipsum');
  });

  test('generates .value', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    adapter.createTemplate(this, page, '<input value="lorem ipsum">');

    assert.equal(page.foo.value, 'lorem ipsum');
  });

  test('generates .then', function(assert) {
    let page = create({
      foo: {}
    });

    adapter.createTemplate(this, page);

    assert.ok(typeof (page.then) === 'function');
    assert.ok(typeof (page.foo.then) === 'function');
  });
});
