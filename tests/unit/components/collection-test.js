import {
  buildAttribute,
  buildAttributeWithOptions,
  fixture,
  it,
  moduleFor
} from '../test-helper';
import { collection } from '../../page-object/collection';
import text from '../../page-object/properties/text';

moduleFor('Components', 'collection');

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
      text: text()
    }
  });

  assert.equal(attribute(1).text(), 'First');
  assert.equal(attribute(2).text(), 'Second');
});

it('generates component for scoped items', function(assert) {
  fixture("<span class='cero'>Cero</span><span>First</span><span>Second</span>");

  let attribute = buildAttribute(collection, {
    itemScope: 'span:not(.cero)',
    item: {
      text: text()
    }
  });

  assert.equal(attribute(1).text(), 'First');
  assert.equal(attribute(2).text(), 'Second');
});

it('generates component for collection object', function(assert) {
  fixture('<span>First</span><span>Second</span><button>Submit</button>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span',
    text: text('button')
  });

  assert.equal(attribute().text(), 'Submit');
});

it('sets scope to components under item object', function(assert) {
  fixture('<button>Wrong</button><span><button>Wrong</button></span><span><button>Right</button></span>');

  let attribute = buildAttribute(collection, {
    itemScope: 'span',
    item: {
      button: {
         text: text('button')
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
      text: text()
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
      text: text()
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
      text: text()
    }
  };

  let attribute = buildAttribute(collection, def);

  attribute = buildAttribute(collection, def);

  assert.equal(attribute(1).text(), 'Dummy');
});

it('throws an error when trying to access to element 0', function(assert) {
  let attribute = buildAttributeWithOptions(collection, { scope: ".scope" }, {
    itemScope: 'span',

    item: {
      text: text()
    }
  });

  assert.throws(function() { attribute(0); }, /collections are 1-based arrays/, 'throws error');
});
