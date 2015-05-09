import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { isHiddenAttribute } from '../../page-object/predicates';

moduleFor('Predicates', 'isHiddenAttribute');

itBehavesLikeAnAttribute(isHiddenAttribute);

it('returns true when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  var predicate = buildAttribute(isHiddenAttribute, '.element');

  assert.ok(predicate());
});

it('returns true when the element doesn\'t exist in the DOM', function(assert) {
  var predicate = buildAttribute(isHiddenAttribute, '.element');

  assert.ok(predicate());
});

it('returns false when the element is visible', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(isHiddenAttribute, '.element');

  assert.ok(!predicate());
});

it('uses scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  var predicate = buildAttribute(isHiddenAttribute, '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element" /><div class="scope"><div class="element" style="display:none" /></div>');

  var predicate = buildAttributeWithOptions(isHiddenAttribute, { scope: '.scope' }, '.element:first');

  assert.ok(predicate());
});
