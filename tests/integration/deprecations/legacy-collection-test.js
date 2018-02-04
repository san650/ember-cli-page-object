import { moduleForComponent, test } from 'ember-qunit';

import { create, collection } from 'ember-cli-page-object';

moduleForComponent('calculating-device', 'Deprecation | legacy collection', {
  integration: true
});

test('shows deprecation warning when first parameter is not a string', function(assert) {
  let page = create({
    foo: collection({
      itemScope: 'li'
    })
  });

  page.foo();

  assert.expectDeprecation('You are currently using the legacy collection API, check the documentation to see how to upgrade to the new API.');
});

test("doesn't show a deprecation warning when first parameter is a string", function(assert) {
  let page = create({
    foo: collection('foo')
  });

  page.foo;

  assert.expectNoDeprecation();
});
