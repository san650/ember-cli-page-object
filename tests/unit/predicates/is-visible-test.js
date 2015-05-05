import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { isVisible } from '../../page-object/predicates';

moduleFor('Predicates', 'isVisible');

itBehavesLikeAnAttribute(isVisible);

it('returns true when the element is visible', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(isVisible, '.element');

  assert.ok(predicate());
});

it('returns false when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  var predicate = buildAttribute(isVisible, '.element');

  assert.ok(!predicate());
});

it('throws an error when the element doesn\'t exist in the DOM', function(assert) {
  assert.expect(1);

  var predicate = buildAttribute(isVisible, '.element');

  try {
    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  var predicate = buildAttribute(isVisible, '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  var predicate = buildAttributeWithOptions(isVisible, { scope: '.scope' }, '.element:first');

  assert.ok(predicate());
});
