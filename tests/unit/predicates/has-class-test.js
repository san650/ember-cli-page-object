import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { notHasClass } from 'page-object/predicates';

moduleFor('Predicates', 'notHasClass');

itBehavesLikeAnAttribute(notHasClass);

it('returns false when the element has the class', function(assert) {
  $('<div>', {
    'class': 'element has-error'
  }).appendTo('#ember-testing');

  var predicate = buildAttribute(notHasClass, 'has-error', '.element');

  assert.ok(!predicate());
});

it('returns true when the element doesn\'t have the class', function(assert) {
  $('<div>', {
    'class': 'element'
  }).appendTo('#ember-testing');

  var predicate = buildAttribute(notHasClass, 'has-error', '.element');

  assert.ok(predicate());
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let predicate = buildAttribute(notHasClass, 'has-error', '.element');

    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  $('<div>', {
    'class': 'element scope has-error'
  })
    .appendTo('#ember-testing')
    .append(
      $('<div>', {
        'class': 'element'
      }));

  var predicate = buildAttribute(notHasClass, 'has-error', '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  $('<div>', {
    'class': 'element scope has-error'
  })
    .appendTo('#ember-testing')
    .append(
      $('<div>', {
        'class': 'element'
      }));

  var predicate = notHasClass('has-error', '.element:first').build('key', { scope: '.scope' });

  assert.ok(predicate());
});
