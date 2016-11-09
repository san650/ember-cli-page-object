import { moduleForProperty } from '../helpers/properties';
import { create, collection, text, hasClass } from 'ember-cli-page-object';
import withIteratorSymbolDefined from '../helpers/with-iterator-symbol-defined';

moduleForProperty('collection', function(test, adapter) {
  test('generates a count property', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span'
      })
    });

    adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo().count, 2);
  });

  test('does not override custom count property', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',

        count: 'custom count'
      })
    });

    adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo().count, 'custom count');
  });

  test('returns an item', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo(0).text, 'Lorem');
    assert.equal(page.foo(1).text, 'Ipsum');
  });

  test('collects an array of items', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    let array = page.foo().toArray();
    assert.equal(array.length, 2);
    assert.equal(array[0].text, 'Lorem');
    assert.equal(array[1].text, 'Ipsum');
  });

  test('delegates configured methods to `toArray()`', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',

        item: {
          isSpecial: hasClass('special'),
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(page.foo().map((i) => i.text), ['Lorem', 'Ipsum']);
    assert.deepEqual(page.foo().mapBy('text'), ['Lorem', 'Ipsum']);

    assert.deepEqual(page.foo().filter((i) => i.isSpecial).map((i) => i.text), ['Lorem']);
    assert.deepEqual(page.foo().filterBy('isSpecial').map((i) => i.text), ['Lorem']);
    let textArray = [];
    page.foo().forEach((i) => {
      textArray.push(i.text);
    });
    assert.deepEqual(textArray, ['Lorem', 'Ipsum']);
  });

  test('produces an iterator for items', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    let textContents = [];
    withIteratorSymbolDefined(() => {
      for (let item of page.foo()) {
        textContents.push(item.text);
      }
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('looks for elements inside the scope', function(assert) {
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

    adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
      </div>
      <div class="scope">
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo(0).text, 'Ipsum');
  });

  test('looks for elements inside multiple scopes', function(assert) {
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

    adapter.createTemplate(this, page, `
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

    assert.equal(page.foo(1).bar.text, 'Sit');
  });

  test('looks for elements inside collection\'s scope', function(assert) {
    let page = create({
      foo: collection({
        scope: '.scope',
        itemScope: 'li',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <ul>
        <li>Lorem</li>
      </ul>
      <ul class="scope">
        <li>Ipsum</li>
      </ul>
    `);

    assert.equal(page.foo(0).text, 'Ipsum');
  });

  test('returns collection\'s component', function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',

        text: text('button')
      })
    });

    adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Second</span>
      <button>Submit</button>
    `);

    assert.equal(page.foo().text, 'Submit');
  });

  test('looks for elements inside collection\'s scope (collection component)', function(assert) {
    let page = create({
      foo: collection({
        scope: '.scope',
        itemScope: 'li',

        text: text('span')
      })
    });

    adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
      </div>
      <div class="scope">
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo().text, 'Ipsum');
  });

  test('resets scope for items', function(assert) {
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

    adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
      </div>
      <div class="scope">
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo(0).text, 'Ipsum');
  });

  test('resets scope for collection\'s component', function(assert) {
    let page = create({
      scope: 'div',

      foo: collection({
        resetScope: true,
        scope: '.scope',
        text: text('span')
      })
    });

    adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
      </div>
      <div class="scope">
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo().text, 'Ipsum');
  });

  test('sets correct scope to child collections', function(assert) {
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

    adapter.createTemplate(this, page, `
      <div><span><em>Lorem</em></span></div>
      <div class="scope"><span><em>Ipsum</em></span></div>
    `);

    assert.equal(page.foo(0).bar(0).text, 'Ipsum');
  });

  test("returns the page object path when item's element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: collection({
          item: {
            baz: {
              qux: text('span')
            }
          }
        })
      }
    });

    adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar(1).baz.qux, /page\.foo\.bar\(1\)\.baz\.qux/);
  });

  test("returns the page object path when collection's element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: collection({
          scope: 'span',

          baz: {
            qux: text('span')
          }
        })
      }
    });

    adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar().baz.qux, /page\.foo\.bar\(\)\.baz\.qux/);
  });

  test("doesn't generate an item or itemScope property", function(assert) {
    let page = create({
      foo: collection({
        itemScope: 'span',
        item: {}
      })
    });

    adapter.createTemplate(this, page);

    assert.notOk(page.foo().item);
    assert.notOk(page.foo().itemScope);
  });

  test('iterates over scoped items with a for loop', function(assert) {
    let page = create({
      foo: collection({
        scope: 'div',
        itemScope: 'span',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <div>
          <span>Lorem</span>
          <span>Ipsum</span>
      </div>
    `);

    let textContents = [];

    for (let i = 0; i < page.foo().count; i++) {
      let item = page.foo(i);
      textContents.push(item.text);
    }

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('iterates over scoped items with a for of loop', function(assert) {
    let page = create({
      foo: collection({
        scope: 'div',
        itemScope: 'span',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <div>
          <span>Lorem</span>
          <span>Ipsum</span>
      </div>
    `);

    let textContents = [];

    withIteratorSymbolDefined(() => {
      for (let item of page.foo()) {
        textContents.push(item.text);
      }
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('iterates over scoped items with a forEach loop', function(assert) {
    let page = create({
      foo: collection({
        scope: 'div',
        itemScope: 'span',

        item: {
          text: text()
        }
      })
    });

    adapter.createTemplate(this, page, `
      <div>
          <span>Lorem</span>
          <span>Ipsum</span>
      </div>
    `);

    let textContents = [];

    page.foo().toArray().forEach(function(item) {
      textContents.push(item.text);
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('does not mutate definition object', function(assert) {
    let prop = text('.baz');
    let expected = {
      scope: '.a-scope',
      itemScope: '.another-scope',
      item: {
        baz: prop
      },

      bar: prop
    };
    let actual = {
      scope: '.a-scope',
      itemScope: '.another-scope',
      item: {
        baz: prop
      },

      bar: prop
    };

    let page = create({
      foo: collection(actual)
    });

    adapter.createTemplate(this, page);

    assert.deepEqual(actual, expected);
  });
});
