import { moduleForProperty } from '../../helpers/properties';
import { create } from 'ember-cli-page-object';

moduleForProperty('Deprecation | create url argument', function(test, adapter) {
  if (adapter === 'application') {
    test('it shows deprecation', async function(assert) {
      create('');

      assert.expectDeprecation('Passing an URL argument to `create()` is deprecated');
    });

    test('it does not show deprecation', async function(assert) {
      create();
      create({});

      assert.expectNoDeprecation();
    });
  }
});
