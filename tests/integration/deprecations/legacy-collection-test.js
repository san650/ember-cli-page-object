import { moduleForComponent, test } from 'ember-qunit';

import { create, collection } from 'ember-cli-page-object';

moduleForComponent('calculating-device', 'Deprecation | legacy collection', {
  integration: true
});

test('usage of itemScope in definition leads to the deprecation', function(assert) {
  let page = create({
    foo: collection({
      itemScope: 'li'
    })
  });

  page.foo();

  assert.expectDeprecation('You are currently using the legacy collection API, check the documentation to see how to upgrade to the new API.');
});

test('usage of scope plus item leads to the deprecation', function(assert) {
  let page = create({
    foo: collection({
      scope: 'foo',
      item: {}
    })
  });

  page.foo();

  assert.expectDeprecation('You are currently using the legacy collection API, check the documentation to see how to upgrade to the new API.');
});

test('usage of scope without item does not lead to the deprecation', function(assert) {
  let page = create({
    foo: collection({
      scope: 'foo',
      bar: {}
    })
  });

  page.foo;

  assert.expectNoDeprecation();
});
