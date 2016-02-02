import { test } from 'qunit';
import { fixture, moduleFor } from './test-helper';
import { create, text } from '../page-object';

moduleFor('Unit | Property | .create');

test('creates new page object', function(assert) {
  var page = create({
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

  var page = create({
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

  var page = create({
    scope: 'span',
    foo: {
    }
  });

  assert.ok(page.isVisible, 'page is visible');
  assert.ok(page.foo.isVisible, 'component is visible');
});

test('generates .isHidden property', function(assert) {
  fixture('Lorem <span style="display:none">ipsum</span>');

  var page = create({
    scope: 'span',
    foo: {
    }
  });

  assert.ok(page.isHidden, 'page is hidden');
  assert.ok(page.foo.isHidden, 'component is hidden');
});

['isVisible', 'isHidden', 'clickOn', 'click', 'contains', 'text'].forEach(prop => {
  test(`does not override .${prop} property`, function(assert) {
    var page = create({
      [prop]: 'foo bar'
    });

    assert.equal(page[prop], 'foo bar');
  });
});

test('generates .clickOn property', function(assert) {
  assert.expect(1);

  window.click = function() {
    assert.ok(true, 'click called');
  };

  var page = create({
    foo: {
    }
  });

  page.foo.clickOn();
});

test('generates .click property', function(assert) {
  assert.expect(1);

  window.click = function() {
    assert.ok(true, 'click called');
  };

  var page = create({
    foo: {
    }
  });

  page.foo.click();
});

test('generates .click property', function(assert) {
  fixture('Ipsum <span>Dolor</span>');

  var page = create({
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

  var page = create({
    scope: '.scope',
    foo: {
      scope: 'span'
    }
  });

  assert.equal(page.text, 'Ipsum Dolor');
  assert.equal(page.foo.text, 'Dolor');
});

test('.extend deep merges attributes', function(assert) {
  var page = create({
    foo: 'foo value',
    bar: {
      baz: 'baz value'
    }
  });

  var extended = page.extend({
    qux: 'qux value',
    bar: {
      norf: 'norf value'
    }
  });

  assert.equal(extended.foo, 'foo value');
  assert.equal(extended.bar.baz, 'baz value');
  assert.equal(extended.qux, 'qux value');
  assert.equal(extended.bar.norf, 'norf value');
});

test('.extend accepts descriptors', function(assert) {
  fixture('Lorem <span>ipsum</span>');

  var page = create({});
  var extended = page.extend({
    foo: text('span')
  });

  assert.equal(extended.foo, 'ipsum');
});

test('.extend doesn\'t modify the original page', function(assert) {
  var page = create({
    foo: 'bar'
  });

  var extended = page.extend({
    foo: 'baz',
    qux: 'norf'
  });

  assert.equal(page.foo, 'bar');
  assert.ok(!page.qux);
  assert.equal(extended.foo, 'baz');
});
