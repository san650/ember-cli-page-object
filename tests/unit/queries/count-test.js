import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import count from '../../page-object/properties/count';

moduleFor('Queries', 'count');

test('returns the number of elements that match the selector', function(assert) {
  fixture('<span /><span />');

  let property = buildProperty(count('span'));

  assert.equal(property.invoke(), 2);
});

test('returns 0 when the selector doesn\'t match elements', function(assert) {
  let property = buildProperty(count('.nothing'));

  assert.equal(property.invoke(), 0);
});

test('uses scope', function(assert) {
  fixture('<div class="scope"><span /></div><span />');

  let property = buildProperty(count('span', { scope: '.scope' }));

  assert.equal(property.invoke(), 1);
});

test('uses page scope', function(assert) {
  fixture('<div class="scope"><span /></div><span />');

  let property = buildProperty(count('span'), { scope: '.scope' });

  assert.equal(property.invoke(), 1);
});
