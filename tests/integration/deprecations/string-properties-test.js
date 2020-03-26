import { module, test } from 'qunit';
import { create } from 'ember-cli-page-object';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  module('Deprecation | string-properties', function() {
    test('works at top-level', function(assert) {
      this.page = create({
        stringProp: ''
      });

      assert.expectDeprecation()
    });

    test('works for nested definitions', function(assert) {
      this.page = create({
        nested: {
          stringProp: ''
        }
      });

      assert.expectDeprecation()
    });

    test('allows scope', function(assert) {
      this.page = create({
        scope: ''
      });

      assert.expectNoDeprecation()
    });

    test('allows testContainer', function(assert) {
      this.page = create({
        testContainer: ''
      });

      assert.expectNoDeprecation()
    });
  });
}
