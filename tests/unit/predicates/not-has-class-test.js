import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { hasClass } from 'page-object/predicates';

moduleFor('Predicates', 'hasClass');

itBehavesLikeAnAttribute(hasClass);

it('returns true when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  var predicate = buildAttribute(hasClass, 'has-error', '.element');

  assert.ok(predicate());
});

it('returns false when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(hasClass, 'has-error', '.element');

  assert.ok(!predicate());
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let predicate = buildAttribute(hasClass, 'has-error', '.element');

    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  var predicate = buildAttribute(hasClass, 'has-error', '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  var predicate = buildAttributeWithOptions(hasClass, { scope: '.scope' }, 'has-error', '.element:first');

  assert.ok(predicate());
});
