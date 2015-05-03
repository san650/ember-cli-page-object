import { module, test as it } from 'qunit';
import { hasClass } from 'ember-cli-page-object/predicates';

module('Predicates - hasClass', {
  beforeEach: function() {
    window.findWithAssert = function(selector) {
      var element = $('#ember-testing').find(selector);

      if (element.length === 0) {
        throw 'Element not found';
      }

      return element;
    };
  },

  afterEach: function() {
    delete window.findWithAssert;
    $('#ember-testing').html('');
  }
});

it('responds to build', function(assert) {
  var builder = hasClass();

  assert.ok($.isFunction(builder.build), '`build` is a function');
});

it('returns a builder function', function(assert) {
  var builder = hasClass(),
      predicate = builder.build('dummy', {});

  assert.ok($.isFunction(predicate), '`build()` is a function');
});

it('returns true when the element has the class', function(assert) {
  $('<div>', {
    'class': 'element has-error'
  }).appendTo('#ember-testing');

  var predicate = hasClass('has-error', '.element').build('key', {});

  assert.ok(predicate());
});

it('returns false when the element doesn\'t have the class', function(assert) {
  $('<div>', {
    'class': 'element'
  }).appendTo('#ember-testing');

  var predicate = hasClass('has-error', '.element').build('key', {});

  assert.ok(!predicate());
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let predicate = hasClass('has-error', '.element').build('key', {});

    predicate();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  $('<div>', {
    'class': 'element scope'
  })
    .appendTo('#ember-testing')
    .append(
      $('<div>', {
        'class': 'element has-error'
      }));

  var predicate = hasClass('has-error', '.element:first', { scope: '.scope' }).build('key', {});

  assert.ok(predicate());
});

it('uses page scope', function(assert) {
  $('<div>', {
    'class': 'element scope'
  })
    .appendTo('#ember-testing')
    .append(
      $('<div>', {
        'class': 'element has-error'
      }));

  var predicate = hasClass('has-error', '.element:first').build('key', { scope: '.scope' });

  assert.ok(predicate());
});
