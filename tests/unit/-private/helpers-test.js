import { test, module } from 'qunit';
import { create, collection } from 'ember-cli-page-object';
import {
  fullScope,
  getProperty,
  objectHasProperty
} from 'ember-cli-page-object/test-support/-private/helpers';

let page;
module('Unit | helpers | fullScope', {
  beforeEach() {
    // postpone legacy collection creation in order to
    // avoid deprecation message on tests startup
    page = create({
      scope: '.calculator',

      keyboard: {
        scope: '.keyboard',

        numbers: collection({
          scope: '.numbers',

          itemScope: 'button'
        })
      }
    });
  }
});

test('calculates full scope for components', function(assert) {
  assert.equal(fullScope(page), '.calculator');
  assert.equal(fullScope(page.keyboard), '.calculator .keyboard');
  assert.equal(fullScope(page.keyboard.numbers(0)), '.calculator .keyboard .numbers button:eq(0)');
});

module('Unit | helpers | objectHasProperty');

test('returns true when the object contains the property', function(assert) {
  const object = {
    foo: 100,
    bar: undefined,
    baz: {
      fizz: null,
      buzz: {
        hello: 'world',
        waldo() {}
      }
    },
    qux() {}
  };

  assert.equal(objectHasProperty(object, 'foo'), true, 'foo');
  assert.equal(objectHasProperty(object, 'bar'), true, 'bar');
  assert.equal(objectHasProperty(object, 'baz'), true, 'baz');
  assert.equal(objectHasProperty(object, 'qux'), true, 'qux');
  assert.equal(objectHasProperty(object, 'baz.fizz'), true, 'baz.fizz');
  assert.equal(objectHasProperty(object, 'baz.buzz'), true, 'baz.buzz');
  assert.equal(objectHasProperty(object, 'baz.buzz.hello'), true, 'baz.buzz.hello');
  assert.equal(objectHasProperty(object, 'baz.buzz.waldo'), true, 'baz.buzz.waldo');
});

test('returns false when the object does not contain the property', function(assert) {
  const object = {
    foo: 100,
    bar: undefined,
    baz: {
      fizz: null,
      buzz: {
        hello: 'world',
        waldo() {}
      }
    },
    qux() {}
  };

  assert.equal(objectHasProperty(object, 'banana'), false, 'banana');
  assert.equal(objectHasProperty(object, 'banana.apple'), false, 'banana.apple');
  assert.equal(objectHasProperty(object, 'foo.banana'), false, 'foo.banana');
  assert.equal(objectHasProperty(object, 'bar.banana'), false, 'bar.banana');
  assert.equal(objectHasProperty(object, 'baz.banana'), false, 'baz.banana');
  assert.equal(objectHasProperty(object, 'qux.banana'), false, 'qux.banana');
  assert.equal(objectHasProperty(object, 'baz.banana.apple'), false, 'baz.banana.apple');
  assert.equal(objectHasProperty(object, 'baz.fizz.banana'), false, 'baz.fizz.banana');
  assert.equal(objectHasProperty(object, 'baz.buzz.banana'), false, 'baz.buzz.banana');
  assert.equal(objectHasProperty(object, 'baz.buzz.hello.banana'), false, 'baz.buzz.hello.banana');
  assert.equal(objectHasProperty(object, 'baz.buzz.waldo.banana'), false, 'baz.buzz.waldo.banana');
});

module('Unit | helpers | getProperty');

test('returns top-level property', function(assert) {
  const object = {
    foo: 100,
    bar: undefined,
    baz: {}
  };

  assert.equal(getProperty(object, 'foo'), 100, 'foo');
  assert.equal(getProperty(object, 'bar'), undefined, 'bar');
  assert.deepEqual(getProperty(object, 'baz'), {}, 'baz');
});

test('returns top-level bound method', function(assert) {
  const object = {
    qux() { return Object.keys(this); }
  };

  const result = getProperty(object, 'qux')();
  assert.deepEqual(result, ['qux']);
});

test('returns nested property', function(assert) {
  const object = {
    baz: {
      fizz: null,
      buzz: {
        hello: 'world'
      }
    }
  };

  assert.equal(getProperty(object, 'baz.fizz'), null, 'baz.fizz');
  assert.deepEqual(getProperty(object, 'baz.buzz'), { hello: 'world' }, 'baz.buzz');
  assert.equal(getProperty(object, 'baz.buzz.hello'), 'world', 'baz.buzz.hello');
});

test('returns nested bound method', function(assert) {
  const object = {
    baz: {
      buzz: {
        waldo() { return Object.keys(this); }
      }
    }
  };

  const result = getProperty(object, 'baz.buzz.waldo')();
  assert.deepEqual(result, ['waldo']);
});

test('returns undefined when the object does not contain the property', function(assert) {
  const object = {
    foo: 100,
    bar: undefined,
    baz: {
      fizz: null,
      buzz: {
        hello: 'world',
        waldo() {}
      }
    },
    qux() {}
  };

  assert.equal(getProperty(object, 'banana'), undefined, 'banana');
  assert.equal(getProperty(object, 'banana.apple'), undefined, 'banana.apple');
  assert.equal(getProperty(object, 'foo.banana'), undefined, 'foo.banana');
  assert.equal(getProperty(object, 'bar.banana'), undefined, 'bar.banana');
  assert.equal(getProperty(object, 'baz.banana'), undefined, 'baz.banana');
  assert.equal(getProperty(object, 'qux.banana'), undefined, 'qux.banana');
  assert.equal(getProperty(object, 'baz.banana.apple'), undefined, 'baz.banana.apple');
  assert.equal(getProperty(object, 'baz.fizz.banana'), undefined, 'baz.fizz.banana');
  assert.equal(getProperty(object, 'baz.buzz.banana'), undefined, 'baz.buzz.banana');
  assert.equal(getProperty(object, 'baz.buzz.hello.banana'), undefined, 'baz.buzz.hello.banana');
  assert.equal(getProperty(object, 'baz.buzz.waldo.banana'), undefined, 'baz.buzz.waldo.banana');
});
