import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, collection, text } from '../../page-object';

moduleFor('.collection');

test('generates a count property', function(assert) {
  fixture(`
    <span>Lorem</span>
    <span>Ipsum</span>
  `);

  let page = create({
    foo: collection({
      itemScope: 'span'
    })
  });

  assert.equal(page.foo().count, 2);
});

test('does not override custom count property', function(assert) {
  fixture(`
    <span>Lorem</span>
    <span>Ipsum</span>
  `);

  let page = create({
    foo: collection({
      itemScope: 'span',

      count: 'custom count'
    })
  });

  assert.equal(page.foo().count, 'custom count');
});

test('returns an item', function(assert) {
  fixture(`
    <span>Lorem</span>
    <span>Ipsum</span>
  `);

  let page = create({
    foo: collection({
      itemScope: 'span',

      item: {
        text: text()
      }
    })
  });

  assert.equal(page.foo(0).text, 'Lorem');
  assert.equal(page.foo(1).text, 'Ipsum');
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div>
      <span>Lorem</span>
    </div>
    <div class="scope">
      <span>Ipsum</span>
    </div>
  `);

  let page = create({
    scope: '.scope',

    foo: collection({
      itemScope: 'span',
      hola: 'mundo',

      item: {
        text: text()
      }
    })
  });

  assert.equal(page.foo(0).text, 'Ipsum');
});

test('looks for elements inside multiple scopes', function(assert) {
  fixture(`
    <ul>
      <li>Blah</li>
      <li>
        <ul class="another-scope">
          <li>Lorem<li>
        </ul>
      </li>
    </ul>
    <ul class="scope">
      <li>Ipsum</li>
      <li>
        <ul>
          <li>Dolor</li>
        </ul>
        <ul class="another-scope">
          <li>Sit</li>
          <li>Amet</li>
        </ul>
      </li>
    </ul>
  `);

  let page = create({
    scope: '.scope',

    foo: collection({
      itemScope: 'li',

      item: {
        bar: {
          scope: '.another-scope',

          text: text('li', { at: 0 })
        }
      }
    })
  });

  assert.equal(page.foo(1).bar.text, 'Sit');
});

test('looks for elements inside collection\'s scope', function(assert) {
  fixture(`
    <ul>
      <li>Lorem</li>
    </ul>
    <ul class="scope">
      <li>Ipsum</li>
    </ul>
  `);

  let page = create({
    foo: collection({
      scope: '.scope',
      itemScope: 'li',

      item: {
        text: text()
      }
    })
  });

  assert.equal(page.foo(0).text, 'Ipsum');
});

test('returns collection\'s component', function(assert) {
  fixture(`
    <span>Lorem</span>
    <span>Second</span>
    <button>Submit</button>
  `);

  let page = create({
    foo: collection({
      itemScope: 'span',

      text: text('button')
    })
  });

  assert.equal(page.foo().text, 'Submit');
});

test('looks for elements inside collection\'s scope (collection component)', function(assert) {
  fixture(`
    <div>
      <span>Lorem</span>
    </div>
    <div class="scope">
      <span>Ipsum</span>
    </div>
  `);

  let page = create({
    foo: collection({
      scope: '.scope',
      itemScope: 'li',

      text: text('span')
    })
  });

  assert.equal(page.foo().text, 'Ipsum');
});

test('resets scope for items', function(assert) {
  fixture(`
    <div>
      <span>Lorem</span>
    </div>
    <div class="scope">
      <span>Ipsum</span>
    </div>
  `);

  let page = create({
    scope: 'div',

    foo: collection({
      resetScope: true,
      scope: '.scope',
      itemScope: 'span',

      item: {
        text: text()
      }
    })
  });

  assert.equal(page.foo(0).text, 'Ipsum');
});

test('resets scope for collection\'s component', function(assert) {
  fixture(`
    <div>
      <span>Lorem</span>
    </div>
    <div class="scope">
      <span>Ipsum</span>
    </div>
  `);

  let page = create({
    scope: 'div',

    foo: collection({
      resetScope: true,
      scope: '.scope',
      text: text('span')
    })
  });

  assert.equal(page.foo().text, 'Ipsum');
});

test('sets correct scope to child collections', function(assert) {
  fixture(`
    <div><span><em>Lorem</em></span></div>
    <div class="scope"><span><em>Ipsum</em></span></div>
  `);

  let page = create({
    foo: collection({
      scope: '.scope',
      itemScope: 'span',

      item: {
        bar: collection({
          itemScope: 'em',
          item: {
            text: text()
          }
        })
      }
    })
  });

  assert.equal(page.foo(0).bar(0).text, 'Ipsum');
});
