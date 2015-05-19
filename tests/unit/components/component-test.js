import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { componentAttribute } from '../../page-object/build';
import { textAttribute } from '../../page-object/queries';

moduleFor('Components', 'component');

itBehavesLikeAnAttribute(componentAttribute, {});

it('uses scope', function(assert) {
  fixture('<strong>Wrong</strong><span class="scope"><strong>Right</strong></span>');

  let attribute = buildAttribute(componentAttribute, {
    scope: '.scope',
    text: textAttribute('strong')
  });

  assert.equal(attribute().text(), 'Right');
});

it('uses parent scope', function(assert) {
  fixture('<strong>Wrong</strong><span class="scope"><strong>Right</strong></span>');

  let attribute = buildAttributeWithOptions(componentAttribute, { scope: '.scope' }, {
    text: textAttribute('strong')
  });

  assert.equal(attribute().text(), 'Right');
});

it('overrides parent scope', function(assert) {
  fixture('<span class="wrong"><strong>Wrong</strong></span><span class="scope"><strong>Right</strong></span>');

  let attribute = buildAttributeWithOptions(componentAttribute, { scope: '.wrong' }, {
    scope: '.scope',
    text: textAttribute('strong')
  });

  assert.equal(attribute().text(), 'Right');
});

it('sets child component scope', function(assert) {
  fixture('<strong>Wrong</strong><span class="scope"><strong>Right</strong></span>');

  let attribute = buildAttribute(componentAttribute, {
    scope: '.scope',

    childComponent: {
      text: textAttribute('strong')
    }
  });

  assert.equal(attribute().childComponent().text(), 'Right');
});
