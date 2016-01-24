import { test } from 'qunit';
import { fixture, moduleFor } from './test-helper';
import { create, text } from '../page-object';

moduleFor('.create');

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
