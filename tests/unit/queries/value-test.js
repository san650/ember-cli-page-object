import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { value } from '../../page-object/queries';

moduleFor('Queries', 'value');

itBehavesLikeAnAttribute(value);

it('returns the text of the input', function(assert) {
  fixture('<input value="Hello world" />');

  var attr = buildAttribute(value, 'input');

  assert.equal(attr(), 'Hello world');
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  var attr = buildAttribute(value, 'span');

  try {
    attr();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('returns empty when the element doesn\'t have value attribute', function(assert) {
  fixture('<span />');

  var attr = buildAttribute(value, 'span');

  assert.equal(attr(), '');
});

it('uses scope', function(assert) {
  fixture('<div class="scope"><input value="Hello" /></div><input value="world!" />');

  var attr = buildAttribute(value, 'input', { scope: '.scope' });

  assert.equal(attr(), 'Hello');
});

it('uses page scope', function(assert) {
  fixture('<div class="scope"><input value="Hello" /></div><input value="world!" />');

  var attr = buildAttributeWithOptions(value, { scope: '.scope' }, 'input');

  assert.equal(attr(), 'Hello');
});
