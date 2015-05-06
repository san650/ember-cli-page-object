import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { text } from '../../page-object/queries';

moduleFor('Queries', 'text');

itBehavesLikeAnAttribute(text);

it('returns the inner text of the element', function(assert) {
  fixture('Hello <span>world!</span>');

  var attr = buildAttribute(text, 'span');

  assert.equal(attr(), 'world!');
});

it('removes white spaces from the beginning and end of the text', function(assert) {
  fixture('<span>  awesome!  </span>');

  var attr = buildAttribute(text, 'span');

  assert.equal(attr(), 'awesome!');
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  var attr = buildAttribute(text, 'span');

  try {
    attr();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('returns empty when the element doesn\'t have text', function(assert) {
  fixture('<span />');

  var attr = buildAttribute(text, 'span');

  assert.equal(attr(), '');
});

it('uses scope', function(assert) {
  fixture('<div class="scope"><span>Hello</span></div><span> world!</span>');

  var attr = buildAttribute(text, 'span', { scope: '.scope' });

  assert.equal(attr(), 'Hello');
});

it('uses page scope', function(assert) {
  fixture('<div class="scope"><span>Hello</span></div><span> world!</span>');

  var attr = buildAttributeWithOptions(text, { scope: '.scope' }, 'span');

  assert.equal(attr(), 'Hello');
});
