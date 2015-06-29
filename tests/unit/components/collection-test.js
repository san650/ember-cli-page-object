import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  itBehavesLikeAnAttribute,
  moduleFor
} from '../test-helper';
import { collection } from '../../page-object/collection';
import { textAttribute } from '../../page-object/queries';

moduleFor('Components', 'collection');

itBehavesLikeAnAttribute(collection, {});

// Count

it('generates a count attribute', function(assert) {
  fixture('<span>First</span><span>Second</span>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span'
  });

  assert.equal(attribute().count(), 2);
});

it('doesn\'t generate a count attribute when it\'s defined', function(assert) {
  fixture('<span>First</span><span>Second</span>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span',
    count: 'myCount'
  });

  assert.equal(attribute().count, 'myCount');
});

it('generates component for item', function(assert) {
  fixture('<span>First</span><span>Second</span>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span',
    item: {
      text: textAttribute()
    }
  });

  assert.equal(attribute(1).text(), 'First');
  assert.equal(attribute(2).text(), 'Second');
});

it('generates component for collection object', function(assert) {
  fixture('<span>First</span><span>Second</span><button>Submit</button>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span',
    text: textAttribute('button')
  });

  assert.equal(attribute().text(), 'Submit');
});

it('sets scope to components under item object', function(assert) {
  fixture('<button>Wrong</button><span><button>Wrong</button></span><span><button>Right</button></span>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span',
    item: {
      button: {
         text: textAttribute('button')
      }
    }
  });

  assert.equal(attribute(2).button().text(), 'Right');
});

it('inherits parent scope by default', function(assert) {
  fixture('<span>Wrong</span><span class="scope"><span>First</span><span>Second</span></span>');

  let attribute = buildAttributeWithOptions(collection, { scope: ".scope" }, {
    itemScope: 'span',

    item: {
      text: textAttribute()
    }
  });

  assert.equal(attribute(1).text(), 'First');
});

it('inherits parent scope for generated count attribute', function(assert) {
  fixture('<span>Wrong</span><span class="scope"><span>First</span><span>Second</span></span>');

  let attribute = buildAttributeWithOptions(collection, { scope: ".scope" }, {
    itemScope: 'span'
  });

  assert.equal(attribute().count(), 2);
});

it('resets parent scope for generated count attribute', function(assert) {
  fixture('<span>Wrong</span><span class="scope"><span>First</span><span>Second</span></span>');

  let attribute = buildAttributeWithOptions(collection, { scope: ".scope" }, {
    scope: '',
    itemScope: 'span'
  });

  assert.equal(attribute().count(), 4);
});

it('resets parent scope', function(assert) {
  fixture('<span>Dummy</span><p class="scope"></p>');

  let attribute = buildAttributeWithOptions(collection, { scope: ".scope" }, {
    scope: '',
    itemScope: 'span',

    item: {
      text: textAttribute()
    }
  });

  assert.equal(attribute(1).text(), 'Dummy');
});

it('does not mutate collection definition after been used', function(assert) {
  fixture('<span>Dummy</span><p class="scope"></p>');

  let def = {
    scope: '',
    itemScope: 'span',

    item: {
      text: textAttribute()
    }
  };

  let attribute = buildAttribute(collection, def);

  attribute = buildAttribute(collection, def);

  assert.equal(attribute(1).text(), 'Dummy');
});
