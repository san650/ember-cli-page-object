import { test, module } from 'qunit';
import { create } from '../page-object/create';

module('Base | create');

test('nests scope by default', function(assert) {
  let definition = {
    scope: '.page',

    component: {
      scope: '.component'
    }
  };

  let pageObject = create(definition);

  assert.equal(pageObject.scope, '.page');
  assert.equal(pageObject.component().scope, '.page .component');
});

test('resets scope if resetScope flag is used', function(assert) {
  let definition = {
    scope: '.page',

    component: {
      scope: '.component',
      resetScope: true
    }
  };

  let pageObject = create(definition);

  assert.equal(pageObject.scope, '.page');
  assert.equal(pageObject.component().scope, '.component');
});

test('returns an object', function(assert) {
  let pageObject = create({});

  assert.ok(pageObject);
});

test('builds properties', function(assert) {
  assert.expect(2);

  let dummyProp = {
     propertyFor: function(target, key) {
        assert.equal(key, 'dummyKey');
        assert.ok(target);
     }
  };

  create({ dummyKey: dummyProp });
});

test('builds a component from a plain object', function(assert) {
  assert.expect(3);

  let dummyProp = {
     propertyFor: function(target, key) {
       assert.equal(key, 'dummyProp');
       assert.ok(target);

       return "a value";
     }
  };

  let dummyComponent = { dummyProp },
      pageObject = create({ dummyComponent });

  assert.equal(pageObject.dummyComponent().dummyProp, "a value");
});

test('builds components recursively', function(assert) {
  let dummyProp = {
     propertyFor: function(target, key) {
       return key;
     }
  };

  let definition = {
    one: dummyProp,
    two: {
      three: dummyProp,
      four: {
        five: dummyProp
      }
    },
    six: {
      seven: dummyProp
    },
    eight: {
      nine: {
        ten: dummyProp
      }
    }
  };

  let pageObject = create(definition);

  assert.equal(pageObject.one, 'one');
  assert.equal(pageObject.two().three, 'three');
  assert.equal(pageObject.two().four().five, 'five');
  assert.equal(pageObject.six().seven, 'seven');
  assert.equal(pageObject.eight().nine().ten, 'ten');
});

test('behaves like a promise', function(assert) {
  let dummyProp = {
    propertyFor: function() {}
  };

  let dummyComponent = { dummyProp },
      pageObject = create({ dummyComponent });

  assert.ok($.isFunction(pageObject.then), "result page object is thennable");
  assert.ok($.isFunction(pageObject.dummyComponent().then), "result component within page object is thennable");
});

test('allows `undefined` keys', function(assert) {
  assert.expect(0);

  create({ key: undefined });
});

test('adds `isVisible` attribute to base page object', function(assert) {
  let pageObject = create({});

  assert.ok(
    $.isFunction(pageObject.isVisible),
    "page object has is visible predicate"
  );
});

test('adds `isVisible` attribute to base page object', function(assert) {
  let pageObject = create({});

  assert.ok(
    $.isFunction(pageObject.isHidden),
    "page object has is hidden predicate"
  );
});

test('adds `clickOn` attribute to base page object', function(assert) {
  let pageObject = create({});

  assert.ok(
    $.isFunction(pageObject.clickOn),
    "page object has is clickOn action"
  );
});

test('adds `click` attribute to base page object', function(assert) {
  let pageObject = create({});

  assert.ok(
    $.isFunction(pageObject.click),
    "page object has is click action"
  );
});

test('adds `contains` attribute to base page object', function(assert) {
  let pageObject = create({});

  assert.ok(
    $.isFunction(pageObject.contains),
    "page object has is contains predicate"
  );
});

test('adds `text` attribute to base page object', function(assert) {
  let pageObject = create({});

  assert.ok(
    $.isFunction(pageObject.text),
    "page object has is text query"
  );
});
