import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { countAttribute } from '../../page-object/queries';

moduleFor('Queries', 'countAttribute');

itBehavesLikeAnAttribute(countAttribute);

it('returns the number of elements that match the selector', function(assert) {
  fixture('<span /><span />');

  var attr = buildAttribute(countAttribute, 'span');

  assert.equal(attr(), 2);
});

it('returns 0 when the selector doesn\'t match elements', function(assert) {
  var attr = buildAttribute(countAttribute, '.nothing');

  assert.equal(attr(), 0);
});

it('uses scope', function(assert) {
  fixture('<div class="scope"><span /></div><span />');

  var attr = buildAttribute(countAttribute, 'span', { scope: '.scope' });

  assert.equal(attr(), 1);
});

it('uses page scope', function(assert) {
  fixture('<div class="scope"><span /></div><span />');

  var attr = buildAttributeWithOptions(countAttribute, { scope: '.scope' }, 'span');

  assert.equal(attr(), 1);
});
