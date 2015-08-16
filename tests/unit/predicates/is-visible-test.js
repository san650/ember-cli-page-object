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
import { isVisibleAttribute } from '../../page-object/predicates';

var application;

moduleFor('Predicates', 'isVisibleAttribute', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

itBehavesLikeAnAttribute(isVisibleAttribute);

it('returns true when the element is visible', function(assert) {
  fixture('<div class="element" />');

  var predicate = buildAttribute(isVisibleAttribute, '.element');

  assert.ok(predicate());
});

it('returns false when the element is hidden', function(assert) {
  fixture('<div class="element" style="display:none" />');

  var predicate = buildAttribute(isVisibleAttribute, '.element');

  assert.ok(!predicate());
});

it('throws an error when the element doesn\'t exist in the DOM', function(assert) {
  assert.expect(1);

  var predicate = buildAttribute(isVisibleAttribute, '.element');

  try {
    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  var predicate = buildAttribute(isVisibleAttribute, '.element:first', { scope: '.scope' });

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  fixture('<div class="element" style="display:none" /><div class="scope"><div class="element" /></div>');

  var predicate = buildAttributeWithOptions(isVisibleAttribute, { scope: '.scope' }, '.element:first');

  assert.ok(predicate());
});
