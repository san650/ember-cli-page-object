import { test } from 'qunit';

export function test_throws_if_not_multiple(fn) {
  test('throws error if selector matches more than one element', function(assert) {
    assert.throws(fn, /matched more than one element. If this is not an error use { multiple: true }/);
  });
}
