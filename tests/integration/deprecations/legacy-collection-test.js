import { module, test } from 'ember-qunit';
import { setupTest } from 'ember-qunit';

import { create, collection } from 'ember-cli-page-object';

import require from 'require';
if (require.has('@ember/test-helpers')) {
  module('Deprecation | legacy collection', function(hooks) {
    setupTest(hooks);

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

    test('shows a warning on invalid legacy collection definitions', function(assert) {
      assert.expectWarning(function() {
        create({
          foo: collection({
          })
        });
      }, 'Legacy page object collection definition is invalid. Please, make sure you include a `itemScope` selector.');
    });
  });
}
