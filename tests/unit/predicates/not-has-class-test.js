import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { notHasClassAttribute } from '../../page-object/predicates';

moduleFor('Predicates', 'notHasClassAttribute');

itBehavesLikeAnAttribute(notHasClassAttribute);

it('returns false when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  var predicate = buildAttribute(notHasClassAttribute, 'has-error', '.element');

  assert.ok(!predicate());
});

it('returns true when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(notHasClassAttribute, 'has-error', '.element');

  assert.ok(predicate());
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  var predicate = buildAttribute(notHasClassAttribute, 'has-error', '.element');

  try {
    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  fixture('<div class="element scope has-error"><div class="element" /></div>');

  var predicate = buildAttribute(notHasClassAttribute, 'has-error', '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element scope has-error"><div class="element" /></div>');

  var predicate = buildAttributeWithOptions(notHasClassAttribute, { scope: '.scope' }, 'has-error', '.element:first');

  assert.ok(predicate());
});
