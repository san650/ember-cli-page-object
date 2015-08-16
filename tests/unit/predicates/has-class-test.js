import Ember from 'ember';
import startApp from '../../helpers/start-app';
import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { hasClassAttribute } from '../../page-object/predicates';

var application;

moduleFor('Predicates', 'hasClassAttribute', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

itBehavesLikeAnAttribute(hasClassAttribute);

it('returns true when the element has the class', function(assert) {
  fixture('<div class="element has-error" />');

  var predicate = buildAttribute(hasClassAttribute, 'has-error', '.element');

  assert.ok(predicate());
});

it('returns false when the element doesn\'t have the class', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(hasClassAttribute, 'has-error', '.element');

  assert.ok(!predicate());
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  var predicate = buildAttribute(hasClassAttribute, 'has-error', '.element');

  try {
    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  var predicate = buildAttribute(hasClassAttribute, 'has-error', '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element scope"><div class="element has-error" /></div>');

  var predicate = buildAttributeWithOptions(hasClassAttribute, { scope: '.scope' }, 'has-error', '.element:first');

  assert.ok(predicate());
});
