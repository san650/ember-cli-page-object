import { test, module } from 'qunit';
import { create, collection } from 'ember-cli-page-object';
import { Query } from 'ember-cli-page-object/-private/query';
import { setupRenderingTest } from '../../helpers';
// @ts-expect-error test-only private import
import Locator from 'ember-cli-page-object/-private/query/locator';
import { getRootElement } from '@ember/test-helpers';

const renderList = (testContext, options) => {
  return testContext.createTemplate(
    `<ul id="root">
      <li class="selector" id="selector_1">
        <h5 id="selector_1_h">1</h5>
      </li>
      <li class="selector" id="selector_2">
        <h5 id="selector_2_h">2</h5>
      </li>
      <li class="selector" id="selector_3">
        <h5 id="selector_3_h">3</h5>
      </li>
    </ul>`,
    options
  );
};

module('Unit | -private/query', function (hooks) {
  setupRenderingTest(hooks);

  test('minimal invocation form', async function (assert) {
    const q = new Query(create());

    await this.createTemplate(`<div id="root">
      <div></div>
    </div>`);

    assert.equal(q.toString(), ':first-child:eq(0)');

    // due to ember-classic scenario to enable the application-template-wrapper
    // we have one extra element in the DOM, which prevents us from using the hard-coded expected selector
    const firstChild = getRootElement().querySelector(':first-child');
    assert.deepEqual(
      q.all().map((e) => e.id),
      // for all the scenarios, but ember-classic it must be ['root']
      [firstChild.id]
    );
  });

  test('respects node scope', async function (assert) {
    const page = create({
      scope: '.selector',
    });

    await renderList(this);

    const q = new Query(page);
    assert.equal(q.toString(), '.selector');
    assert.deepEqual(
      q.all().map((e) => e.id),
      ['selector_1', 'selector_2', 'selector_3']
    );
  });

  test('scope as a getter', async function (assert) {
    const page = create({
      get scope() {
        return new Locator('.selector', {
          at: 2,
        });
      },
    });

    await renderList(this);

    const q = new Query(page);
    assert.equal(q.toString(), '.selector:eq(2)');
    assert.deepEqual(
      q.all().map((e) => e.id),
      ['selector_3']
    );
  });

  test('it works', async function (assert) {
    const page = create({
      scope: 'ul',
      collection: collection('li', {
        title: {
          scope: 'h5',
        },
      }),
    });

    const q = new Query(page.collection[1].title);

    await renderList(this);

    assert.deepEqual(
      q.all().map((el) => el.id),
      ['selector_2_h']
    );
    assert.equal(q.toString(), 'ul li:eq(1) h5');
  });

  test('testContainer', async function (assert) {
    const page = create({
      scope: 'ul',
      testContainer: '#alternate-ember-testing',

      collection: collection('li', {
        title: {
          scope: 'h5',
        },
      }),
    });

    const q = new Query(page.collection[1].title);

    await renderList(this, {
      useAlternateContainer: true,
    });

    assert.deepEqual(
      q.all().map((el) => el.id),
      ['selector_2_h']
    );
    assert.equal(q.toString(), 'ul li:eq(1) h5');
  });

  module('resetScope', function () {
    const renderPlayground = (testContext) => {
      return testContext.createTemplate(
        `<div id="root1">
          <div class="independent-selector" id="element1"></div>
        </div>
        <div class="selector" id="root2">
          <div class="independent-selector" id="element2"></div>
        </div>`
      );
    };

    test('with scope', async function (assert) {
      const page = create({
        scope: '.selector',
        child: {
          scope: '.independent-selector',
          resetScope: true,
        },
      });

      const q = new Query(page.child);

      await renderPlayground(this);

      assert.deepEqual(
        q.all().map((el) => el.id),
        ['element1', 'element2']
      );
      assert.equal(q.toString(), '.independent-selector');
    });

    test('without scope', async function (assert) {
      const page = create({
        scope: '.selector',
        child: {
          resetScope: true,
        },
      });

      const q = new Query(page.child, {
        resetScope: true,
      });

      await renderPlayground(this);

      // due to ember-classic scenario to enable the application-template-wrapper
      // we have one extra element in the DOM, which prevents us from using the hard-coded expected selector
      const firstChild = getRootElement().querySelector(':first-child');
      assert.deepEqual(
        q.all().map((el) => el.id),
        // for all the scenarios, but ember-classic it must be ['root']
        [firstChild.id]
      );
      assert.equal(q.toString(), ':first-child:eq(0)');
    });

    test('child nodes inherit resetScope', async function (assert) {
      const page = create({
        scope: '.selector',

        reset: {
          resetScope: true,

          child: {
            scope: '.independent-selector',
          },
        },
      });

      const q = new Query(page.reset.child, {
        resetScope: true,
      });

      await renderPlayground(this);

      assert.deepEqual(
        q.all().map((el) => el.id),
        ['element1', 'element2']
      );
      assert.equal(q.toString(), '.independent-selector');
    });

    module('options', function () {
      test('with selector', async function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          selector: '.independent-selector',
          resetScope: true,
        });

        await renderPlayground(this);

        assert.deepEqual(
          q.all().map((el) => el.id),
          ['element1', 'element2']
        );
        assert.equal(q.toString(), '.independent-selector');
      });

      test('without selector', async function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          resetScope: true,
        });

        await renderPlayground(this);

        assert.deepEqual(
          q.all().map((el) => el.id),
          ['root2']
        );
        assert.equal(q.toString(), '.selector');
      });
    });
  });

  module('options', function () {
    test('all the filters', async function (assert) {
      const page = create({
        scope: '#root',
      });

      await renderList(this);

      const q = new Query(page, {
        selector: '.selector',
        at: 0,
        last: true, // `at` takes precedence
        contains: '2',
        visible: true,
      });

      assert.equal(q.toString(), '#root .selector:visible:contains("2"):eq(0)');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_2']
      );
    });

    test('accepts string', async function (assert) {
      const page = create({
        scope: '#root',
      });

      await renderList(this);

      const q = new Query(page, '.selector');

      assert.equal(q.toString(), '#root .selector');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_1', 'selector_2', 'selector_3']
      );
    });

    test('selector', async function (assert) {
      const page = create({
        scope: '#root',
      });

      await renderList(this);

      const q = new Query(page, {
        selector: '.selector',
      });

      assert.equal(q.toString(), '#root .selector');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_1', 'selector_2', 'selector_3']
      );
    });

    test('at', async function (assert) {
      const page = create();

      await renderList(this);

      const q = new Query(page, {
        selector: '.selector',
        at: 1,
      });

      assert.equal(q.toString(), '.selector:eq(1)');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_2']
      );
    });

    test('last', async function (assert) {
      const page = create();

      await renderList(this);

      const q = new Query(page, {
        selector: '.selector',
        last: true,
      });

      assert.equal(q.toString(), '.selector:last');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_3']
      );
    });

    test('visible', async function (assert) {
      const page = create();

      await this.createTemplate(
        `<ul id="root">
          <li class="selector" id="selector_1" style="display:none;">
            <h5 id="selector_1_h">1</h5>
          </li>
          <li class="selector" id="selector_2">
            <h5 id="selector_2_h">2</h5>
          </li>
          <li class="selector" id="selector_3" style="display:none;">
            <h5 id="selector_3_h">3</h5>
          </li>
        </ul>`
      );

      const q = new Query(page, {
        selector: '.selector',
        visible: true,
      });

      assert.equal(q.toString(), '.selector:visible');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_2']
      );
    });

    test('contains', async function (assert) {
      const page = create();

      await renderList(this);

      const q = new Query(page, {
        selector: '.selector',
        contains: '3',
      });

      assert.equal(q.toString(), '.selector:contains("3")');
      assert.deepEqual(
        q.all().map((el) => el.id),
        ['selector_3']
      );
    });
  });
});
