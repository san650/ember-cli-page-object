import Ember from 'ember';
import startApp from '../../helpers/start-app';
import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { clickableAttribute } from '../../page-object/actions';

var application;

moduleFor('Actions', 'clickableAttribute', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

itBehavesLikeAnAttribute(clickableAttribute);

it('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'button';

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  buildAttribute(clickableAttribute, expectedSelector)();
});

it('uses scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttribute(clickableAttribute, '.element', { scope: '.scope' })();
});

it('uses page scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttributeWithOptions(clickableAttribute, { scope: '.scope' }, '.element')();
});
