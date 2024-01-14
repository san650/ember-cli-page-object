import { collection, create, hasClass, text } from 'ember-cli-page-object';
import withIteratorSymbolDefined from '../../../helpers/with-iterator-symbol-defined';
import { setupRenderingTest, TestContext } from '../../../helpers';
import { module, test } from 'qunit';

module('collection', function (hooks) {
  setupRenderingTest(hooks);

  test('returns the same collection instance', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span'),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo, page.foo);
  });

  test(`returns the same collection's item instance`, async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span'),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo[0], page.foo[0]);
  });

  test('generates a length property', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span'),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.length, 2);
  });

  test('Works with zero length', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span'),
    });

    await this.createTemplate(`
      <div>Lorem</div>
      <div>Ipsum</div>
    `);

    assert.equal(page.foo.length, 0);
  });

  test('returns an item', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.objectAt(0)!.text, 'Lorem');
    assert.equal(page.foo.objectAt(1)!.text, 'Ipsum');
  });

  test('collects an array of items', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    const array = page.foo.toArray();
    assert.equal(array.length, 2);
    assert.equal(array[0]?.text, 'Lorem');
    assert.equal(array[1]?.text, 'Ipsum');

    const proxyArray = page.foo.toArray();
    assert.equal(proxyArray.length, 2);
    assert.equal(proxyArray[0]?.text, 'Lorem');
    assert.equal(proxyArray[1]?.text, 'Ipsum');
  });

  test('produces an iterator for items', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    const textContents: string[] = [];
    withIteratorSymbolDefined(() => {
      for (const item of page.foo) {
        textContents.push(item.text);
      }
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('looks for elements inside the scope', async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <div>
        <span>Lorem</span>
      </div>
      <div class="scope">
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo.objectAt(0)!.text, 'Ipsum');
  });

  test('looks for elements inside multiple scopes', async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: collection('li', {
        bar: {
          scope: '.another-scope',

          text: text('li', { at: 0 }),
        },
      }),
    });

    await this.createTemplate(`
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

    assert.equal(page.foo.objectAt(1)!.bar.text, 'Sit');
  });

  test('resets scope for items', async function (this: TestContext, assert) {
    const page = create({
      scope: 'div',

      foo: collection('span', {
        resetScope: true,
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <div>
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo.objectAt(0)!.text, 'Lorem');
  });

  test('sets correct scope to child collections', async function (this: TestContext, assert) {
    const page = create({
      scope: '.scope',

      foo: collection('span', {
        bar: collection('em', {
          text: text(),
        }),
      }),
    });

    await this.createTemplate(`
      <div><span><em>Lorem</em></span></div>
      <div class="scope"><span><em>Ipsum</em></span></div>
    `);

    assert.equal(page.foo.objectAt(0)!.bar.objectAt(0)!.text, 'Ipsum');
  });

  test('iterates over scoped items with a for loop', async function (this: TestContext, assert) {
    const page = create({
      scope: 'div',
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
      </div>
    `);

    const textContents: string[] = [];

    for (let i = 0; i < page.foo.length; i++) {
      const item = page.foo.objectAt(i)!;
      textContents.push(item.text);
    }

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('iterates over scoped items with a for of loop', async function (this: TestContext, assert) {
    const page = create({
      scope: 'div',
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
      </div>
    `);

    const textContents: string[] = [];

    withIteratorSymbolDefined(() => {
      for (const item of page.foo) {
        textContents.push(item.text);
      }
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('iterates over scoped items with a forEach loop', async function (this: TestContext, assert) {
    const page = create({
      scope: 'div',

      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
      </div>
    `);

    const textContents: string[] = [];

    page.foo.forEach((item) => {
      textContents.push(item.text);
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('does not mutate definition object', async function (this: TestContext, assert) {
    const prop = text('.baz');

    const expected = {
      bar: prop,
      baz: {
        qux: prop,
      },
    };

    const actual = {
      bar: prop,
      baz: {
        qux: prop,
      },
    };

    create({
      foo: collection('.another-scope', actual),
    });

    assert.deepEqual(actual, expected);
  });

  test('looks for elements within test container specified', async function (this: TestContext, assert) {
    assert.expect(2);

    const expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: collection('span', {
        testContainer: expectedContext,
      }),
    });

    await this.createTemplate('<span>Lorem</span><span>ipsum</span>', {
      useAlternateContainer: true,
    });

    assert.equal(page.foo.length, 2);
    assert.equal(page.foo.objectAt(0)!.text, 'Lorem');
  });

  test('objectAt returns an item', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.objectAt(0)!.text, 'Lorem');
    assert.equal(page.foo.objectAt(1)!.text, 'Ipsum');
  });

  test('forEach works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    const textArray: string[] = [];
    page.foo.forEach((i) => {
      textArray.push(i.text);
    });

    assert.deepEqual(textArray, ['Lorem', 'Ipsum']);
  });

  test('map works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(
      page.foo.map((i) => i.text),
      ['Lorem', 'Ipsum']
    );
  });

  test('mapBy works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(page.foo.mapBy('text'), ['Lorem', 'Ipsum']);
  });

  test('findOneBy works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.findOneBy('text', 'Lorem').text, 'Lorem');
  });

  test('findOneBy throws error if > 1 elements found', async function (this: TestContext, assert) {
    assert.expect(1);
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
      <span>Ipsum</span>
      <span>Ipsum</span>
    `);

    const expectedError = new RegExp(
      `3 elements found by text: "Ipsum", but expected 1\n\nPageObject: 'page.foo'`
    );

    assert.throws(
      () => page.foo.findOneBy('text', 'Ipsum'),
      expectedError,
      'throws error'
    );
  });

  test('findOneBy throws error if no elements found', async function (this: TestContext, assert) {
    assert.expect(1);
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
      <span>Ipsum</span>
    `);

    const expectedError = new RegExp(
      `cannot find element by text: "Wrong"\n\nPageObject: 'page.foo'`
    );

    assert.throws(
      () => page.foo.findOneBy('text', 'Wrong'),
      expectedError,
      'throws error'
    );
  });

  test('findOne works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.findOne((i) => i.text === 'Lorem').text, 'Lorem');
  });

  test('findOne throws error if > 1 elements found', async function (this: TestContext, assert) {
    assert.expect(1);
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
      <span>Ipsum</span>
    `);

    const expectedError = new RegExp(
      `2 elements found by condition, but expected 1\n\nPageObject: 'page.foo'`
    );

    assert.throws(
      () => page.foo.findOne((e) => e.text === 'Ipsum'),
      expectedError,
      'throws error'
    );
  });

  test('findOne throws error if no elements found', async function (this: TestContext, assert) {
    assert.expect(1);
    const page = create({
      foo: collection('span', {
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
      <span>Ipsum</span>
    `);

    const expectedError = new RegExp(
      `cannot find element by condition\n\nPageObject: 'page.foo'`
    );

    assert.throws(
      () => page.foo.findOne(() => false),
      expectedError,
      'throws error'
    );
  });

  test('filter works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        isSpecial: hasClass('special'),
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(
      page.foo.filter((i) => i.isSpecial).map((i) => i.text),
      ['Lorem']
    );
    assert.deepEqual(
      page.foo.filter((i) => i['isFoo'] as any).map((i) => i.text),
      []
    );
  });

  test('filterBy works correctly', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span', {
        isSpecial: hasClass('special'),
        text: text(),
      }),
    });

    await this.createTemplate(`
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(
      page.foo.filterBy('isSpecial').map((i) => i.text),
      ['Lorem']
    );
    assert.deepEqual(
      page.foo.filterBy('isFoo' as any).map((i) => i.text),
      []
    );
  });

  test('uses array accessor', async function (this: TestContext, assert) {
    const page = create({
      foo: collection('span'),
    });

    await this.createTemplate(`
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo[0]?.text, 'Lorem');
    assert.equal(page.foo[1]?.text, 'Ipsum');
  });
});
