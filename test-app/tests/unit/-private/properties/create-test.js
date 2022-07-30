import { setupApplicationTest, setupRenderingTest } from '../../../helpers';
import { create, text } from 'ember-cli-page-object';
import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';

module('create', function () {
  module('default', function (hooks) {
    setupRenderingTest(hooks);

    test('creates new page object', async function (assert) {
      let page = create({
        foo: 'a value',
        bar: {
          baz: 'another value',
        },
      });

      await this.createTemplate('');

      assert.equal(page.foo, 'a value');
      assert.equal(page.bar.baz, 'another value');
    });

    test('resets scope', async function (assert) {
      let page = create({
        scope: '.invalid-scope',

        foo: {
          scope: '.scope',
          resetScope: true,
          bar: text(),
        },
      });

      await this.createTemplate(`
        <div>
          <span class="scope">Lorem</span>
        </div>
      `);

      assert.equal(page.foo.bar, 'Lorem');
    });

    test('does not mutate definition object', async function (assert) {
      let prop = text('.baz');
      let expected = {
        scope: '.a-scope',
        foo: {
          baz: prop,
        },

        bar: prop,
      };
      let actual = {
        scope: '.a-scope',
        foo: {
          baz: prop,
        },

        bar: prop,
      };

      create(actual);

      assert.deepEqual(actual, expected);
    });

    test('generates a default scope', async function (assert) {
      let page = create({});

      await this.createTemplate('<p>Lorem ipsum</p>');

      assert.ok(page.contains('ipsum'));
    });

    test('"context" key is not allowed', async function (assert) {
      assert.throws(
        () =>
          create({
            context: {},
          }),
        new Error(
          '"context" key is not allowed to be passed at definition root.'
        )
      );
    });
  });

  module('by url', function (hooks) {
    setupApplicationTest(hooks);

    test('generates default visit helper', async function (assert) {
      assert.expect(1);

      let page = create('/html-render');

      await page.visit();

      assert.equal(currentURL(), '/html-render');
    });

    test('generates default visit helper plus a definition', async function (assert) {
      assert.expect(2);

      let page = create('/html-render', {
        nonExisting: {
          scope: '.some-class',
        },
      });

      await page.visit();

      assert.equal(currentURL(), '/html-render');
      assert.equal(page.nonExisting.isVisible, false);
    });
  });
});
