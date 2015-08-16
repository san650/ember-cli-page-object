import Ember from 'ember';
import startApp from '../../helpers/start-app';
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
import {
  isHiddenAttribute,
  isVisibleAttribute
} from '../../page-object/predicates';

var application;

moduleFor('Components', 'component', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

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

it('lets define attributes without selector if page has scope defined', function(assert) {
  fixture('<span class="scope" style="display:none;">Hidden</span>');

  let attribute = buildAttribute(componentAttribute, {
    scope: '.scope',

    hidden: isHiddenAttribute(),
    visible: isVisibleAttribute()
  });

  assert.equal(attribute().hidden(), true);
  assert.equal(attribute().visible(), false);
});
