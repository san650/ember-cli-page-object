import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { textAttribute } from '../../page-object/queries';

moduleFor('Queries', 'textAttribute');

itBehavesLikeAnAttribute(textAttribute);

it('returns the inner text of the element', function(assert) {
  fixture('Hello <span>world!</span>');

  var attr = buildAttribute(textAttribute, 'span');

  assert.equal(attr(), 'world!');
});

it('removes white spaces from the beginning and end of the text', function(assert) {
  fixture('<span>  awesome!  </span>');

  var attr = buildAttribute(textAttribute, 'span');

  assert.equal(attr(), 'awesome!');
});

it('normalizes inner text of the element containing newlines', function(assert) {
  fixture(['<span>', 'Hello', 'multi-line', 'world!', '</span>'].join("\n"));

  var attr = buildAttribute(textAttribute, 'span');

  assert.equal(attr(), 'Hello multi-line world!');
});

it('raises an error when the element doesn\'t exist', function(assert) {
  assert.expect(1);

  var attr = buildAttribute(textAttribute, 'span');

  try {
    attr();
  } catch(e) {
    assert.ok(true, 'Element not found');
  }
});

it('returns empty when the element doesn\'t have text', function(assert) {
  fixture('<span />');

  var attr = buildAttribute(textAttribute, 'span');

  assert.equal(attr(), '');
});

it('uses scope', function(assert) {
  fixture('<div class="scope"><span>Hello</span></div><span> world!</span>');

  var attr = buildAttribute(textAttribute, 'span', { scope: '.scope' });

  assert.equal(attr(), 'Hello');
});

it('uses page scope', function(assert) {
  fixture('<div class="scope"><span>Hello</span></div><span> world!</span>');

  var attr = buildAttributeWithOptions(textAttribute, { scope: '.scope' }, 'span');

  assert.equal(attr(), 'Hello');
});
