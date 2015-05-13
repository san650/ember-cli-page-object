import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { attributeAttribute } from '../../page-object/queries';

moduleFor('Queries', 'attributeAttribute');

itBehavesLikeAnAttribute(attributeAttribute);

it('returns element attribute\'s value', function(assert) {
  fixture('<img src="/path/to/image.png" />');

  var attr = buildAttribute(attributeAttribute, 'src', 'img');

  assert.equal(attr(), '/path/to/image.png');
});

it('returns null when the attribute doesn\'t exist', function(assert) {
  fixture('<img />');

  var attr = buildAttribute(attributeAttribute, 'alt', 'img');

  assert.equal(attr(), null);
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let attr = buildAttribute(attributeAttribute, 'alt', 'img');

    attr();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('uses scope', function(assert) {
  fixture('<div class="scope logo"><img class="logo" alt="Logo small" /></div>');

  var attr = buildAttribute(attributeAttribute, 'alt', '.logo', { scope: '.scope' });

  assert.equal(attr(), 'Logo small');
});

it('uses page scope', function(assert) {
  fixture('<div class="scope logo"><img class="logo" alt="Logo small" /></div>');

  var attr = buildAttributeWithOptions(attributeAttribute, { scope: '.scope' }, 'alt', '.logo');

  assert.equal(attr(), 'Logo small');
});
