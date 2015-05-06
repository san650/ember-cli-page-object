import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { isHidden } from '../../page-object/predicates';

moduleFor('Predicates', 'isHidden');

itBehavesLikeAnAttribute(isHidden);

it('returns true when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  var predicate = buildAttribute(isHidden, '.element');

  assert.ok(predicate());
});

it('returns true when the element doesn\'t exist in the DOM', function(assert) {
  var predicate = buildAttribute(isHidden, '.element');

  assert.ok(predicate());
});

it('returns false when the element is visible', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(isHidden, '.element');

  assert.ok(!predicate());
});

it('uses scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  var predicate = buildAttribute(isHidden, '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  var predicate = buildAttributeWithOptions(isHidden, { scope: '.scope' }, '.element:first');

  assert.ok(predicate());
});
