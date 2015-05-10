import {
  buildAttribute,
  buildAttributeWithOptions,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { clickable } from '../../page-object/actions';

let OriginalClick = window.click;

moduleFor('Actions', 'clickable', {
  afterEach: function() {
    window.click = OriginalClick;
  }
});

itBehavesLikeAnAttribute(clickable);

it('calls Ember\'s click helper', function(assert) {
  assert.expect(1);

  let expectedSelector = 'button';

  window.click = function(actualSelector) {
    assert.equal(actualSelector, expectedSelector);
  };

  buildAttribute(clickable, expectedSelector)();
});

it('uses scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttribute(clickable, '.element', { scope: '.scope' })();
});

it('uses page scope', function(assert) {
  assert.expect(1);

  window.click = function(actualSelector) {
    assert.equal(actualSelector, '.scope .element');
  };

  buildAttributeWithOptions(clickable, { scope: '.scope' }, '.element')();
});
