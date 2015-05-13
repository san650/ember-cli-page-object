import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { clickableAttribute } from '../../page-object/actions';

let OriginalClick = window.click;

moduleFor('Actions', 'clickableAttribute', {
  afterEach: function() {
    window.click = OriginalClick;
  }
});

itBehavesLikeAnAttribute(clickableAttribute);

it('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'button';

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  buildAttribute(clickableAttribute, expectedSelector)();
});

it('uses scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttribute(clickableAttribute, '.element', { scope: '.scope' })();
});

it('uses page scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttributeWithOptions(clickableAttribute, { scope: '.scope' }, '.element')();
});
