import Ember from 'ember';
import startApp from '../../helpers/start-app';
import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { clickOnTextAttribute } from '../../page-object/actions';

var application;

moduleFor('Actions', 'clickOnTextAttribute', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

itBehavesLikeAnAttribute(clickOnTextAttribute);

it('calls Ember\' click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'button :contains("dummy text"):last';

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  buildAttribute(clickOnTextAttribute, 'button')('dummy text');
});

it('uses scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element :contains("dummy text"):last');
  };

  buildAttribute(clickOnTextAttribute, '.element', { scope: '.scope' })('dummy text');
});

it('uses page scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element :contains("dummy text"):last');
  };

  buildAttributeWithOptions(clickOnTextAttribute, { scope: '.scope' }, '.element')('dummy text');
});
