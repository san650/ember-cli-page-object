import { module, test } from 'qunit';
import { create } from 'ember-cli-page-object';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  const DEPRECATION_MESSAGE = 'setContext() is deprecated. Please make sure you use "@ember/test-helpers" of v1 or higher.';

  module('Deprecation | setContext', function() {
    test('passing page context to create is deprecated', function(assert) {
      this.page = create().setContext(this);

      assert.expectDeprecation(DEPRECATION_MESSAGE)
    });

    test('passing page context to create is deprecated', function(assert) {
      this.page = create({
        context: this
      });

      assert.expectDeprecation(DEPRECATION_MESSAGE)
    });
  });
}
