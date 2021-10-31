import { setupRenderingTest } from '../../helpers';
import { test, module } from 'qunit';
import {
  isPageObject,
  getPageObjectDefinition,
} from 'ember-cli-page-object/test-support/-private/helpers';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  alias,
  getter,
  create,
  triggerable,
  collection,
  isVisible,
  text,
  value
} from 'ember-cli-page-object';

module('Unit | composition', function () {
  test('each page object node stores its definition', function (assert) {
    let definition = {
      foo: {
        bar: {
          baz: 'prop',
        },
      },
    };

    let page = create(definition);
    let storedDef = getPageObjectDefinition(page);
    assert.ok(storedDef);
    assert.deepEqual(storedDef, definition);

    let fooDef = getPageObjectDefinition(page.foo);
    assert.ok(fooDef);
    assert.deepEqual(fooDef, {
      bar: {
        baz: 'prop',
      },
    });

    let barDef = getPageObjectDefinition(page.foo.bar);
    assert.ok(barDef);
    assert.deepEqual(barDef, {
      baz: 'prop',
    });
  });

  test('page objects can be composed from other page objects', function (assert) {
    let definition = {
      foo: {
        bar: {
          baz: 'prop',
        },
      },
    };

    let page = create(definition);
    let pageComposer = create({
      somePage: page,
    });
    assert.ok(pageComposer);
    assert.ok(pageComposer.somePage);

    let pageComposerDef = getPageObjectDefinition(pageComposer);
    assert.ok(pageComposerDef);
    assert.ok(isPageObject(pageComposerDef.somePage));
    // we cant deep equal the definition since it contains a page object so we check the keys instead
    assert.deepEqual(Object.keys(pageComposerDef), ['somePage']);
    let somePageStoredDef = getPageObjectDefinition(pageComposerDef.somePage);
    assert.deepEqual(somePageStoredDef, definition);
  });

  test('page objects can be used as the definition to create', function (assert) {
    let definition = {
      foo: 'prop',
    };

    let page = create(definition);

    let pageComposer = create(page);
    assert.ok(pageComposer);
    assert.ok(pageComposer.foo);

    assert.deepEqual(getPageObjectDefinition(pageComposer), definition);
  });

  test('page object composition supports many levels deep', function (assert) {
    let definition = {
      foo: {
        bar: {
          baz: 'prop',
        },
      },
    };

    let page = create(definition);

    let pageComposer = create({
      bar: {
        baz: page,
      },
    });
    assert.ok(pageComposer);
    assert.ok(pageComposer.bar.baz);

    // test that the definition is stored "as is"
    let pageComposerDef = getPageObjectDefinition(pageComposer);
    assert.ok(pageComposerDef);
    assert.ok(pageComposerDef.bar);
    assert.notOk(isPageObject(pageComposerDef.bar));
    assert.ok(pageComposer.bar.baz);
    assert.ok(isPageObject(pageComposerDef.bar.baz));

    let bazDefiniton = getPageObjectDefinition(pageComposerDef.bar.baz);
    assert.ok(bazDefiniton);
    pageComposerDef.bar.baz = bazDefiniton;
    // cant do a true deep equal without firing of page object selectors
    assert.deepEqual(Object.keys(pageComposerDef), ['bar']);
    assert.deepEqual(bazDefiniton, definition);
  });

  test('can compose from page object nested within another page object', function (assert) {
    const { foo } = create({
      foo: {
        scope: '.foo',
      },
    });

    assert.ok(foo);
    assert.deepEqual(
      getPageObjectDefinition(foo),
      { scope: '.foo' },
      'nested stores definition'
    );

    const bar = create({ foo });
    assert.ok(bar);

    let barDefinition = getPageObjectDefinition(bar);
    assert.ok(barDefinition);
    assert.ok(barDefinition.foo);
    assert.ok(isPageObject(barDefinition.foo));

    let fooDefFromBar = getPageObjectDefinition(bar.foo);
    assert.ok(fooDefFromBar);

    // cannot do a true deep equal since foo is a page object
    assert.deepEqual(Object.keys(barDefinition), ['foo']);
    assert.deepEqual(fooDefFromBar, {
      scope: '.foo',
    });
  });

  test('getPageObjectDefinition errors if node is not a page object', function (assert) {
    assert.throws(function () {
      return getPageObjectDefinition({});
    }, 'cannot get the page object definition from a node that is not a page object');
  });

  module('all properties via compsition', function (hooks) {
    setupRenderingTest(hooks);

    test('can alias through composition', async function (assert) {
      assert.expect(1);

      const aliasPage = create({
        isButtonVisible: isVisible('button'),
        aliasedIsButtonVisible: alias('isButtonVisible'),
      });

      let page = create({
        scope: '.container',
        aliasPage: aliasPage,
      });
      await render(
        hbs`<div class="container"><button>Look at me</button></div>`
      );

      assert.ok(page.aliasPage.aliasedIsButtonVisible);
    });

    test('new pages can be composed from pages containing collections', async function (assert) {
      let collectionPage = create({
        foo: collection('span', {
          text: text(),
        }),
      });

      let page = create({
        scope: '.container',
        collectionPage: collectionPage,
      });
      await render(hbs`
        <div class="container">
          <span>Lorem</span>
          <span>Ipsum</span>
        </div>
      `);
      assert.equal(page.collectionPage.foo.objectAt(0).text, 'Lorem');
      assert.equal(page.collectionPage.foo.objectAt(1).text, 'Ipsum');
    });

    test('collection supports taking a page object directly as its definition', async function (assert) {
      const textPage = create({
        spanText: text('span'),
      });
      let page = create({
        scope: '.container',
        collection: collection('li', textPage),
      });

      await render(hbs`
        <ul class="container">
          <li>Text <span>Lorem</span></li>
          <li>Text <span>Ipsum</span></li>
        </ul>
      `);

      assert.equal(page.collection.objectAt(0).spanText, 'Lorem');
      assert.equal(page.collection.objectAt(1).spanText, 'Ipsum');
    });

    test('the collection definition can be composed from page objects', async function (assert) {
      const textPage = create({
        spanText: text('span'),
      });
      let page = create({
        scope: '.container',
        collection: collection('li', {
          textPage: textPage,
        }),
      });
      await render(hbs`
        <ul class="container">
          <li>Text <span>Lorem</span></li>
          <li>Text <span>Ipsum</span></li>
        </ul>
      `);

      assert.equal(page.collection.objectAt(0).textPage.spanText, 'Lorem');
      assert.equal(page.collection.objectAt(1).textPage.spanText, 'Ipsum');
    });

    test("the composition of pages containing 'action' based descriptors is supported", async function (assert) {
      assert.expect(1);

      let expectedSelector = 'input';
      let triggerPage = create({
        foo: triggerable('focus', expectedSelector),
      });

      let page = create({
        scope: '.container',
        triggerPage: triggerPage,
      });
      await render(hbs`<div class="container"><input /></div>`);

      find(expectedSelector).addEventListener('focus', () => {
        assert.ok(1);
      });

      await page.triggerPage.foo();
    });

    test('new pages can be composed from pages containing custom getters', function (assert) {
      assert.expect(2);

      const getterPage = create({
        foo: getter(function () {
          return 'lorem';
        }),
        bar: getter(function () {
          return 'ipsum';
        }),
      });
      let page = create({
        scope: '.container',
        getterPage: getterPage,
      });
      assert.equal(page.getterPage.foo, 'lorem');
      assert.equal(page.getterPage.bar, 'ipsum');
    });

    test('the composition of pages containing a getter based attribute is supported', async function (assert) {
      let inputPage = create({
        foo: value('input'),
      });

      let page = create({
        scope: '.container',
        input: inputPage,
      });
      await render(
        hbs`<div class="container"><input value="Lorem ipsum"></div>`
      );

      assert.equal(page.input.foo, 'Lorem ipsum');
    });
  });
});


