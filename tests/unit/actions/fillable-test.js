import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { fillableAttribute } from '../../page-object/actions';

let OriginalFillIn = window.fillIn;

moduleFor('Actions', 'fillableAttribute', {
  afterEach: function() {
    window.fillIn = OriginalFillIn;
  }
});

itBehavesLikeAnAttribute(fillableAttribute);

it('calls Ember\'s fillIn helper', function(assert) {
  assert.expect(2);

  let selector = '.element',
      text = 'dummy text';

  window.fillIn = function(actualSelector, actualText) {
    assert.equal(actualSelector, selector);
    assert.equal(actualText, text);
  };

  buildAttribute(fillableAttribute, selector)(text);
});

it('uses scope', function(assert) {
  assert.expect(1);

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttribute(fillableAttribute, '.element', { scope: '.scope' })();
});

it('uses page scope', function(assert) {
  assert.expect(1);

  window.fillIn = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttributeWithOptions(fillableAttribute, { scope: '.scope' }, '.element')();
});
