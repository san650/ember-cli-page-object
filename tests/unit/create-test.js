import { test, module } from 'qunit';
import { create } from '../page-object';

module('.create');

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
