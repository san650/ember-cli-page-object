import { moduleForProperty } from '../helpers/properties';
import { create, text } from 'ember-cli-page-object';

moduleForProperty('create', function(test, adapter) {
  test('creates new page object', function(assert) {
    let page = create({
      foo: 'a value',
      bar: {
        baz: 'another value'
      }
    });

    adapter.createTemplate(this, page);

    assert.equal(page.foo, 'a value');
    assert.equal(page.bar.baz, 'another value');
  });

  if (adapter.name === 'acceptance') {
    test('generates default visit helper', function(assert) {
      assert.expect(1);

      let page = create('/foo');

      adapter.createTemplate(this, page);

      adapter.visit((path) => {
        assert.equal(path, '/foo');
      });

      page.visit();
    });

    test('generates default visit helper plus a definition', function(assert) {
      assert.expect(2);

      let page = create('/foo', { foo: text('span') });

      adapter.createTemplate(this, page, '<span>dummy text</span>');

      adapter.visit((path) => {
        assert.equal(path, '/foo');
      });

      page.visit();
      assert.equal(page.foo, 'dummy text');
    });
  }

  test('resets scope', function(assert) {
    let page = create({
      scope: '.invalid-scope',

      foo: {
        scope: '.scope',
        resetScope: true,
        bar: text()
      }
    });

    adapter.createTemplate(this, page, `
      <div>
        <span class="scope">Lorem</span>
      </div>
    `);

    assert.equal(page.foo.bar, 'Lorem');
  });

  test('generates .isVisible property', function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    adapter.createTemplate(this, page, 'Lorem <span>ipsum</span>');

    assert.ok(page.isVisible, 'page is visible');
    assert.ok(page.foo.isVisible, 'component is visible');
  });

  test('generates .isHidden property', function(assert) {
    let page = create({
      scope: 'span',
      foo: {
      }
    });

    adapter.createTemplate(this, page, 'Lorem <span style="display:none">ipsum</span>');

    assert.ok(page.isHidden, 'page is hidden');
    assert.ok(page.foo.isHidden, 'component is hidden');
  });

  ['isVisible', 'isHidden', 'clickOn', 'click', 'contains', 'text', 'fillIn', 'select'].forEach((prop) => {
    test(`does not override .${prop} property`, function(assert) {
      let page = create({
        [prop]: 'foo bar'
      });

      adapter.createTemplate(this, page);

      assert.equal(page[prop], 'foo bar');
    });
  });

  test('generates .clickOn property', function(assert) {
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

  test('generates .click property', function(assert) {
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

  test('generates .click property', function(assert) {
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

  test('generates .contains property', function(assert) {
    let page = create({
      foo: {
        scope: 'span'
      }
    });

    adapter.createTemplate(this, page, 'Ipsum <span>Dolor</span>');

    assert.ok(page.foo.contains('or'), 'contains');
  });

  test('generates .text property', function(assert) {
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

  test('generates .fillIn property', function(assert) {
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

  test('generates .select property', function(assert) {
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

  test('generates .value property', function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        scope: 'input'
      }
    });

    adapter.createTemplate(this, page, '<input value="lorem ipsum">');

    assert.equal(page.foo.value, 'lorem ipsum');
  });

  test('generates .then property', function(assert) {
    let page = create({
      foo: {}
    });

    adapter.createTemplate(this, page);

    assert.ok(typeof (page.then) === 'function');
    assert.ok(typeof (page.foo.then) === 'function');
  });

  test('does not mutate definition object', function(assert) {
    let prop = text('.baz');
    let expected = {
      context: '.a-context',
      scope: '.a-scope',
      foo: {
        baz: prop
      },

      bar: prop
    };
    let actual = {
      context: '.a-context',
      scope: '.a-scope',
      foo: {
        baz: prop
      },

      bar: prop
    };

    let page = create(actual);

    adapter.createTemplate(this, page);

    assert.deepEqual(actual, expected);
  });

  test('generates a default scope', function(assert) {
    let page = create({});

    adapter.createTemplate(this, page, '<p>Lorem ipsum</p>');

    assert.ok(page.contains('ipsum'));
  });
});
