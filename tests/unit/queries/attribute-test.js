import { test as it } from 'qunit';
import { moduleFor } from '../test-helper';
import { attribute } from 'page-object/queries';

moduleFor('Queries', 'attribute');

it('responds to build', function(assert) {
  var builder = attribute();

  assert.ok($.isFunction(builder.build), '`build` is a function');
});

it('returns a builder function', function(assert) {
  var builder = attribute(),
      predicate = builder.build('dummy', {});

  assert.ok($.isFunction(predicate), '`build()` is a function');
});

it('returns element attribute\'s value', function(assert) {
  $('<img>', {
    'src': '/path/to/image.png'
  }).appendTo('#ember-testing');

  var attr = attribute('src', 'img').build('key', {});

  assert.equal(attr(), '/path/to/image.png');
});

it('returns null when the attribute doesn\'t exist', function(assert) {
  $('<img>').appendTo('#ember-testing');

  var attr = attribute('alt', 'img').build('key', {});

  assert.equal(attr(), null);
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let attr = attribute('alt', 'img').build('key', {});

    attr();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  $('<img>', {
    'alt': 'Logo',
    'class': 'scope'
  })
    .appendTo('#ember-testing')
    .append(
      $('<img>', {
        'alt': 'Logo small'
      }));

  var attr = attribute('alt', 'img', { scope: '.scope' }).build('key', {});

  assert.equal(attr(), 'Logo small');
});

it('uses page scope', function(assert) {
  $('<img>', {
    'alt': 'Logo',
    'class': 'element scope has-error'
  })
    .appendTo('#ember-testing')
    .append(
      $('<img>', {
        'alt': 'Logo small'
      }));

  var attr = attribute('alt', 'img').build('key', { scope: '.scope' });

  assert.equal(attr(), 'Logo small');
});
