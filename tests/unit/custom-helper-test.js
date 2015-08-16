import Ember from 'ember';
import startApp from '../helpers/start-app';
import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from './test-helper';
import { customHelper } from '../page-object/custom-helper';
import { textAttribute } from '../page-object/queries';

var application;

moduleFor('Helpers', 'customHelper', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

itBehavesLikeAnAttribute(customHelper(function() {}));

it('accepts a selector', function(assert) {
  assert.expect(1);

  let helper = customHelper(function(selector) {
    assert.equal(selector, '.selector');
  });

  let attribute = buildAttribute(helper, '.selector');

  attribute();
});

it('uses scope', function(assert) {
  assert.expect(1);

  let helper = customHelper(function(selector) {
    assert.equal(selector, '.scope .selector');
  });

  let attribute = buildAttribute(helper, '.selector', { scope: '.scope' });

  attribute();
});

it('uses index', function(assert) {
  assert.expect(1);

  let helper = customHelper(function(selector) {
    assert.equal(selector, '.selector:eq(2)');
  });

  let attribute = buildAttribute(helper, '.selector', { index: 3 });

  attribute();
});

it('uses page scope', function(assert) {
  assert.expect(1);

  let helper = customHelper(function(selector) {
    assert.equal(selector, '.scope .selector');
  });

  let attribute = buildAttributeWithOptions(helper, { scope: '.scope' }, '.selector');

  attribute();
});

it('returns simple values', function(assert) {
  let helper = customHelper(function() {
    return 'dummy string';
  });

  let attribute = buildAttribute(helper);

  assert.equal(attribute(), 'dummy string');
});

it('returns components', function(assert) {
  fixture('<strong>Wrong</strong><span class="scope"><strong>Right</strong></span>');

  let helper = customHelper(function() {
    return {
      scope: '.scope',
      text: textAttribute('strong')
    };
  });

  let attribute = buildAttribute(helper);

  assert.equal(attribute().text(), 'Right');
});

it('returns functions', function(assert) {
  let helper = customHelper(function() {
    return function() {
      return 'dummy string';
    };
  });

  let attribute = buildAttribute(helper);

  assert.equal(attribute(), 'dummy string');
});

it('pass function invocation params to inner function', function(assert) {
  assert.expect(2);

  let helper = customHelper(function() {
    return function(param1, param2) {
      assert.equal(param1, 'lorem');
      assert.equal(param2, 'ipsum');
    };
  });

  let attribute = buildAttribute(helper);

  attribute('lorem', 'ipsum');
});

it('pass options hash to helper', function(assert) {
  assert.expect(2);

  let helper = customHelper(function(selector, options) {
    assert.equal(options.dummy, 'value');
    assert.equal(options.another, 'dummy value');
  });

  let attribute = buildAttribute(helper, '.selector', { dummy: 'value', another: 'dummy value' });

  attribute();
});
