import { moduleForProperty } from '../../../helpers/properties';
import { create, collection } from 'ember-cli-page-object';

moduleForProperty('dsl', function(test) {
  test('generates .isVisible', async function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.isVisible, 'page is visible');
    assert.ok(page.foo.isVisible, 'component is visible');
  });

  test('generates .isHidden', async function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.isHidden, 'page is hidden');
    assert.ok(page.foo.isHidden, 'component is hidden');
  });

  test('generates .isPresent', async function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.isPresent, 'page is rendered in DOM');
    assert.ok(page.foo.isPresent, 'component is rendered in DOM');
  });

  ['blur', 'click', 'clickOn', 'contains', 'fillIn', 'focus', 'isHidden', 'isPresent', 'isVisible', 'select', 'text', 'value'].forEach((prop) => {
    test(`does not override .${prop}`, async function(assert) {
      let page = create({
        [prop]: 'foo bar'
      });

      await this.adapter.createTemplate(this, page);

      assert.equal(page[prop], 'foo bar');
    });
  });

  test('generates .blur', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button'
      }
    });

    await this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    this.adapter.$('button').focus().on('blur', () => assert.ok(1));

    await this.adapter.await(page.foo.blur());
  });

  test('generates .clickOn', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
      }
    });

    await this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    // text nodes don't support click events
    // instead we check that click on text content propagates to the parent button
    this.adapter.$('button').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo.clickOn('dummy text'));
  });

  test('generates .click', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button'
      }
    });

    await this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    this.adapter.$('button').one('click', () => assert.ok(1));

    await this.adapter.await(page.foo.click());
  });

  test('generates .contains', async function(assert) {
    let page = create({
      foo: {
        scope: 'span'
      }
    });

    await this.adapter.createTemplate(this, page, 'Ipsum <span>Dolor</span>');

    assert.ok(page.foo.contains('or'), 'contains');
  });

  test('generates .text', async function(assert) {
    let page = create({
      scope: '.scope',
      foo: {
        scope: 'span'
      }
    });

    await this.adapter.createTemplate(this, page, `
      <div>Lorem</div>
      <div class="scope">Ipsum <span>Dolor</span></div>
    `);

    assert.equal(page.text, 'Ipsum Dolor');
    assert.equal(page.foo.text, 'Dolor');
  });

  test('generates .fillIn', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    await this.adapter.createTemplate(this, page, '<input name="email">');

    await this.adapter.await(page.foo.fillIn('lorem ipsum'));

    assert.equal(this.adapter.$('input').val(), 'lorem ipsum');
  });

  test('generates .focus', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'button'
      }
    });

    await this.adapter.createTemplate(this, page, '<button>dummy text</button>');

    this.adapter.$('button').on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo.focus());
  });

  test('generates .select', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    await this.adapter.createTemplate(this, page, '<input name="email">');

    await this.adapter.await(page.foo.select('lorem ipsum'));

    assert.equal(this.adapter.$('input').val(), 'lorem ipsum');
  });

  test('generates .value', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    await this.adapter.createTemplate(this, page, '<input value="lorem ipsum">');

    assert.equal(page.foo.value, 'lorem ipsum');
  });

  test('generates .then', async function(assert) {
    let page = create({
      foo: {}
    });

    await this.adapter.createTemplate(this, page);

    assert.ok(typeof (page.then) === 'function');
    assert.ok(typeof (page.foo.then) === 'function');
  });

  test('generates .as', async function(assert) {
    assert.expect(2);

    let page = create({
      scope: 'span',
      foo: {
        baz: 'foobar'
      }
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    let foo = page.foo.as(element => {
      assert.equal(element.text, 'ipsum');
    });

    assert.equal(foo.baz, 'foobar');
  });

  test('generates .as when nested', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: 'span',
      foo: {
        bar: {
          scope: 'strong'
        }
      }
    });

    await this.adapter.createTemplate(this, page, 'Lorem <span>ipsum <strong>dolor</strong></span>');

    page.foo.bar.as(element => {
      assert.equal(element.text, 'dolor');
    });
  });

  test('generates .as in collections', async function(assert) {
    assert.expect(2);

    let page = create({
      items: collection({
        itemScope: 'ul li'
      })
    });

    await this.adapter.createTemplate(this, page, `
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
