import { test } from 'qunit';
import {
  fixture,
  moduleFor,
  buildProperty
} from '../test-helper';
import { collection } from '../../page-object/collection';
import text from '../../page-object/properties/text';

moduleFor('Components', 'collection');

test('generates a count attribute', function(assert) {
  fixture('<span>First</span><span>Second</span>');

  let attribute = buildProperty(
    collection({itemScope: 'span'})
  ).toFunction();

  assert.equal(attribute().count(), 2);
});

test('doesn\'t generate a count attribute when it\'s defined', function(assert) {
  fixture('<span>First</span><span>Second</span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',
      count: 'myCount'
    })
  ).toFunction();

  assert.equal(attribute().count, 'myCount');
});

test('generates component for item', function(assert) {
  fixture('<span>First</span><span>Second</span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',
      item: {
        text: text()
      }
    })
  ).toFunction();

  assert.equal(attribute(1).text(), 'First');
  assert.equal(attribute(2).text(), 'Second');
});

test('generates component for scoped items', function(assert) {
  fixture("<span class='cero'>Cero</span><span>First</span><span>Second</span>");

  let attribute = buildProperty(
    collection({
      itemScope: 'span:not(.cero)',
      item: {
        text: text()
      }
    })
  ).toFunction();

  assert.equal(attribute(1).text(), 'First');
  assert.equal(attribute(2).text(), 'Second');
});

test('generates component for collection object', function(assert) {
  fixture('<span>First</span><span>Second</span><button>Submit</button>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',
      text: text('button')
    })
  ).toFunction();

  assert.equal(attribute().text(), 'Submit');
});

test('sets scope to components under item object', function(assert) {
  fixture('<button>Wrong</button><span><button>Wrong</button></span><span><button>Right</button></span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',
      item: {
        button: {
           text: text('button')
        }
      }
    })
  ).toFunction();

  assert.equal(attribute(2).button().text(), 'Right');
});

test('inherits parent scope by default', function(assert) {
  fixture('<span>Wrong</span><span class="scope"><span>First</span><span>Second</span></span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',

      item: {
        text: text()
      }
    }),
    { scope: ".scope" }
  ).toFunction();

  assert.equal(attribute(1).text(), 'First');
});

test('inherits parent scope for generated count attribute', function(assert) {
  fixture('<span>Wrong</span><span class="scope"><span>First</span><span>Second</span></span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span'
    }),
    { scope: ".scope" }
  ).toFunction();

  assert.equal(attribute().count(), 2);
});

test('resets parent scope for generated count attribute', function(assert) {
  fixture('<span>Wrong</span><span class="scope"><span>First</span><span>Second</span></span>');

  let attribute = buildProperty(
    collection({
      scope: '',
      itemScope: 'span'
    }),
    { scope: ".scope" }
  ).toFunction();

  assert.equal(attribute().count(), 4);
});

test('resets parent scope', function(assert) {
  fixture('<span>Dummy</span><p class="scope"></p>');

  let attribute = buildProperty(
    collection({
      scope: '',
      itemScope: 'span',

      item: {
        text: text()
      }
    }),
    { scope: ".scope" }
  ).toFunction();

  assert.equal(attribute(1).text(), 'Dummy');
});

test('does not mutate collection definition after been used', function(assert) {
  fixture('<span>Dummy</span><p class="scope"></p>');

  let def = {
    scope: '',
    itemScope: 'span',

    item: {
      text: text()
    }
  };

  buildProperty(collection(def)).toFunction();

  let attribute = buildProperty(collection(def)).toFunction();

  assert.equal(attribute(1).text(), 'Dummy');
});

test('throws an error when trying to access to element 0', function(assert) {
  let attribute = buildProperty(
    collection({
      itemScope: 'span',

      item: {
        text: text()
      }
    }),
    { scope: ".scope" }
  ).toFunction();

  assert.throws(function() { attribute(0); }, /collections are 1-based arrays/, 'throws error');
});

test('assigns the correct scope to item sub components', function(assert) {
  fixture('<span><p>Lorem</p></span><span><p>Ipsum</p></span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',
      item: {
        anotherComponent: {
          scope: 'p',
          text: text()
        }
      }
    })
  ).toFunction();

  assert.equal(attribute(1).anotherComponent().text(), 'Lorem');
});

test('assigns the correct scope to item sub components when component doesn\'t defines a scope', function(assert) {
  fixture('<span><p>Lorem</p></span><span><p>Ipsum</p></span>');

  let attribute = buildProperty(
    collection({
      itemScope: 'span',
      item: {
        anotherComponent: {
          text: text()
        }
      }
    })
  ).toFunction();

  assert.equal(attribute(1).anotherComponent().text(), 'Lorem');
});

test('assigns the correct scope to sub collection component', function(assert) {
  fixture('<div><span></span><span></span></div><div><span></span></div>');

  let attribute = buildProperty(
    collection({
      itemScope: 'div',
      item: {
        spans: collection({
          itemScope: 'span'
        })
      }
    })
  ).toFunction();

  assert.equal(attribute(1).spans().count(), 2);
});

test('assigns the correct scope to sub collection items', function(assert) {
  fixture('<div><span>Lorem</span><span>Ipsum</span></div><div><span>Dolor</span></div>');

  let attribute = buildProperty(
    collection({
      itemScope: 'div',
      item: {
        spans: collection({
          itemScope: 'span',
          item: {
            text: text()
          }
        })
      }
    })
  ).toFunction();

  assert.equal(attribute(1).spans(2).text(), 'Ipsum');
});

import { create } from '../../page-object/create';

test('doesn\'t mutate collection definition', function(assert) {
  fixture('<div>Lorem <p> Ipsum <span>Dolor</span> <span> Ergo</span></p></div>');

  let component = {
    scope: 'p',

    four: collection({
      itemScope: 'span',
      item: {
        text: text(),
      }
    })
  };

  create({
    one: {
      scope: 'div',

      two: component
    }
  });

  let pageObject = create({
    one: {
      scope: 'div',

      two: component
    }
  });

  assert.equal(pageObject.one().two().four(1).text(), 'Dolor');
});
