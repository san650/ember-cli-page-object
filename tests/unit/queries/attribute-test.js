import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { attribute } from 'page-object/queries';

moduleFor('Queries', 'attribute');

itBehavesLikeAnAttribute(attribute);

it('returns element attribute\'s value', function(assert) {
  $('<img>', {
    'src': '/path/to/image.png'
  }).appendTo('#ember-testing');

  var attr = buildAttribute(attribute, 'src', 'img');

  assert.equal(attr(), '/path/to/image.png');
});

it('returns null when the attribute doesn\'t exist', function(assert) {
  $('<img>').appendTo('#ember-testing');

  var attr = buildAttribute(attribute, 'alt', 'img');

  assert.equal(attr(), null);
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let attr = buildAttribute(attribute, 'alt', 'img');

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

  var attr = buildAttribute(attribute, 'alt', 'img', { scope: '.scope' });

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

  var attr = buildAttributeWithOptions(attribute, { scope: '.scope' }, 'alt', 'img');

  assert.equal(attr(), 'Logo small');
});
