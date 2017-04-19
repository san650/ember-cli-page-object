import { moduleForProperty } from '../helpers/properties';
import { create, collection } from 'ember-cli-page-object';

moduleForProperty('dsl', function(test) {
  test('generates .isVisible', function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.isVisible, 'page is visible');
    assert.ok(page.foo.isVisible, 'component is visible');
  });

  test('generates .isHidden', function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    this.adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.isHidden, 'page is hidden');
    assert.ok(page.foo.isHidden, 'component is hidden');
  });

  ['isVisible', 'isHidden', 'clickOn', 'click', 'contains', 'text', 'fillIn', 'select', 'value'].forEach((prop) => {
    test(`does not override .${prop}`, function(assert) {
      let page = create({
        [prop]: 'foo bar'
      });

      this.adapter.createTemplate(this, page);

      assert.equal(page[prop], 'foo bar');
    });
  });

  test('generates .clickOn', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
      }
    });

    this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    this.adapter.click(() => {
      assert.ok(true, 'click called');
    });

    page.foo.clickOn('dummy text');

    return this.adapter.wait();
  });

  test('generates .click', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button'
      }
    });

    this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    this.adapter.click(() => {
      assert.ok(true, 'click called');
    });

    page.foo.click();

    return this.adapter.wait();
  });

  test('generates .contains', function(assert) {
    let page = create({
      foo: {
        scope: 'span'
      }
    });

    this.adapter.createTemplate(this, page, 'Ipsum <span>Dolor</span>');

    assert.ok(page.foo.contains('or'), 'contains');
  });

  test('generates .text', function(assert) {
    let page = create({
      scope: '.scope',
      foo: {
        scope: 'span'
      }
    });

    this.adapter.createTemplate(this, page, `
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

    this.adapter.createTemplate(this, page, '<input name="email">');

    this.adapter.fillIn((selector, context, options, content) => {
      assert.equal(content, 'lorem ipsum');
    });

    page.foo.fillIn('lorem ipsum');

    return this.adapter.wait();
  });

  test('generates .select', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    this.adapter.createTemplate(this, page, '<input name="email">');

    this.adapter.fillIn((selector, context, options, content) => {
      assert.equal(content, 'lorem ipsum');
    });

    page.foo.select('lorem ipsum');

    return this.adapter.wait();
  });

  test('generates .value', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    this.adapter.createTemplate(this, page, '<input value="lorem ipsum">');

    assert.equal(page.foo.value, 'lorem ipsum');
  });

  test('generates .then', function(assert) {
    let page = create({
      foo: {}
    });

    this.adapter.createTemplate(this, page);

    assert.ok(typeof (page.then) === 'function');
    assert.ok(typeof (page.foo.then) === 'function');
  });

  test('generates .as', function(assert) {
    assert.expect(2);

    let page = create({
      scope: 'span',
      foo: {
        baz: 'foobar'
      }
    });

    this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    let foo = page.foo.as(element => {
      assert.equal(element.text, 'ipsum');
    });

    assert.equal(foo.baz, 'foobar');
  });

  test('generates .as when nested', function(assert) {
    assert.expect(1);

    let page = create({
      scope: 'span',
      foo: {
        bar: {
          scope: 'strong'
        }
      }
    });

    this.adapter.createTemplate(this, page, 'Lorem <span>ipsum <strong>dolor</strong></span>');

    page.foo.bar.as(element => {
      assert.equal(element.text, 'dolor');
    });
  });

  test('generates .as in collections', function(assert) {
    assert.expect(2);

    let page = create({
      items: collection({
        itemScope: 'ul li'
      })
    });

    this.adapter.createTemplate(this, page, `
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>
    `);

    page.items(0).as(item => {
      assert.equal(item.text, 'foo');
    });

    page.items(1).as(item => {
      assert.equal(item.text, 'bar');
    });
  });
});
