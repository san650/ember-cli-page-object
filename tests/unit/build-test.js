import { test, module } from 'qunit';
import { build } from '../page-object/build';

module('Base | build');

test('returns an object', function(assert) {
  let pageObject = build({});

  assert.ok(pageObject);
});

test('copies keys recursively', function(assert) {
  let pageObject = build({
    key1: "a string",
    key2: {
      childKey: "another string"
    }
  });

  assert.equal(pageObject.key1, "a string");
  assert.equal(pageObject.key2.childKey, "another string");
});

test('builds properties', function(assert) {
  assert.expect(2);

  let dummyProp = {
     propertyFor: function(target, key) {
        assert.equal(key, 'dummyKey');
        assert.ok(target);
     }
  };

  build({ dummyKey: dummyProp });
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
      pageObject = build({ dummyComponent });

  assert.equal(pageObject.dummyComponent().dummyProp, "a value");
});

test('behaves like a promise', function(assert) {
  let dummyProp = {
    propertyFor: function() {}
  };

  let dummyComponent = { dummyProp },
    pageObject = build({ dummyComponent });

  assert.ok($.isFunction(pageObject.then), "result page object is thennable");
  assert.ok($.isFunction(pageObject.dummyComponent().then), "result component within page object is thennable");
});
