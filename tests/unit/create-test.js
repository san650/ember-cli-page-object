import { test } from 'qunit';
import { fixture, moduleFor } from './test-helper';
import { create, text } from '../page-object';

moduleFor('Unit | Property | .create');

test('creates new page object', function(assert) {
  let page = create({
    foo: 'a value',
    bar: {
      baz: 'another value'
    }
  });

  assert.equal(page.foo, 'a value');
  assert.equal(page.bar.baz, 'another value');
});

test('resets scope', function(assert) {
  fixture(`
    <div>
      <span class="scope">Lorem</span>
    </div>
  `);

  let page = create({
    scope: '.invalid-scope',

    foo: {
      scope: '.scope',
      resetScope: true,
      bar: text()
    }
  });

  assert.equal(page.foo.bar, 'Lorem');
});

test('generates .isVisible property', function(assert) {
  fixture('Lorem <span>ipsum</span>');

  let page = create({
    scope: 'span',
    foo: {
    }
  });

  assert.ok(page.isVisible, 'page is visible');
  assert.ok(page.foo.isVisible, 'component is visible');
});

test('generates .isHidden property', function(assert) {
  fixture('Lorem <span style="display:none">ipsum</span>');

  let page = create({
    scope: 'span',
    foo: {
    }
  });

  assert.ok(page.isHidden, 'page is hidden');
  assert.ok(page.foo.isHidden, 'component is hidden');
});

['isVisible', 'isHidden', 'clickOn', 'click', 'contains', 'text', 'fillIn', 'select'].forEach((prop) => {
  test(`does not override .${prop} property`, function(assert) {
    let page = create({
      [prop]: 'foo bar'
    });

    assert.equal(page[prop], 'foo bar');
  });
});

test('generates .clickOn property', function(assert) {
  fixture('<button>dummy text</button>');
  assert.expect(1);

  window.click = function() {
    assert.ok(true, 'click called');
  };

  let page = create({
    foo: {
    }
  });

  page.foo.clickOn('dummy text');
});

test('generates .click property', function(assert) {
  fixture('<button>dummy text</button>');
  assert.expect(1);

  window.click = function() {
    assert.ok(true, 'click called');
  };

  let page = create({
    foo: {
      scope: 'button'
    }
  });

  page.foo.click();
});

test('generates .contains property', function(assert) {
  fixture('Ipsum <span>Dolor</span>');

  let page = create({
    foo: {
      scope: 'span'
    }
  });

  assert.ok(page.foo.contains('or'), 'contains');
});

test('generates .text property', function(assert) {
  fixture(`
    <div>Lorem</div>
    <div class="scope">Ipsum <span>Dolor</span></div>
  `);

  let page = create({
    scope: '.scope',
    foo: {
      scope: 'span'
    }
  });

  assert.equal(page.text, 'Ipsum Dolor');
  assert.equal(page.foo.text, 'Dolor');
});

test('generates .fillIn property', function(assert) {
  fixture('<input name="email">');
  assert.expect(1);

  window.fillIn = function(selector, text) {
    assert.equal(text, 'lorem ipsum');
  };

  let page = create({
    foo: {
      scope: 'input'
    }
  });

  page.foo.fillIn('lorem ipsum');
});

test('generates .select property', function(assert) {
  fixture('<input name="email">');
  assert.expect(1);

  window.fillIn = function(selector, text) {
    assert.equal(text, 'lorem ipsum');
  };

  let page = create({
    foo: {
      scope: 'input'
    }
  });

  page.foo.select('lorem ipsum');
});

test('generates .then property', function(assert) {
  let page = create({
    foo: {}
  });

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

  create(actual);

  assert.deepEqual(actual, expected);
});

test('generates a default scope', function(assert) {
  fixture('Lorem ipsum');

  let page = create({});

  assert.ok(page.contains('ipsum'));
});
