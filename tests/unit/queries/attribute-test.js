import { test } from 'qunit';
import { buildProperty, fixture, moduleFor } from '../test-helper';
import attribute from '../../page-object/properties/attribute';

moduleFor('Queries', 'attribute');

test('returns element attribute\'s value', function(assert) {
  fixture('<img src="/path/to/image.png" />');

  let property = buildProperty(attribute('src', 'img'));

  assert.equal(property.invoke(), '/path/to/image.png');
});

test('returns null when the attribute doesn\'t exist', function(assert) {
  fixture('<img />');

  let property = buildProperty(attribute('alt', 'img'));

  assert.equal(property.invoke(), null);
});

test('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  try {
    let property = buildProperty(attribute('alt', 'img'));

    property.invoke();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

test('uses scope', function(assert) {
  fixture('<div class="scope logo"><img class="logo" alt="Logo small" /></div>');

  let property = buildProperty(attribute('alt', '.logo', { scope: '.scope' }));

  assert.equal(property.invoke(), 'Logo small');
});

test('uses parent scope', function(assert) {
  fixture('<div class="scope logo"><img class="logo" alt="Logo small" /></div>');

  let property = buildProperty(attribute('alt', '.logo'), { scope: '.scope' });

  assert.equal(property.invoke(), 'Logo small');
});

test('searches for element by index if provided', function(assert) {
  fixture('<img alt="img1" class="img"/><img alt="img2" class="img"/>');

  let property = buildProperty(attribute('alt', '.img', { index: 2 }));

  assert.equal(property.invoke(), 'img2');
});
