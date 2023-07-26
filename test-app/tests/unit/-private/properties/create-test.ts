import { setupRenderingTest, TestContext } from '../../../helpers';
import { create, text } from 'ember-cli-page-object';
import { module, test } from 'qunit';

module('create', function () {
  module('default', function (hooks) {
    setupRenderingTest(hooks);

    test('creates new page object', async function (this: TestContext, assert) {
      let page = create({
        get foo() {
          return 'a value';
        },
        bar: {
          get baz() {
            return 'another value'
          },
        },
      });

      await this.createTemplate('');

      assert.equal(page.foo, 'a value');
      assert.equal(page.bar.baz, 'another value');
    });

    test('resets scope', async function (this: TestContext, assert) {
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

    test('does not mutate definition object', async function (this: TestContext, assert) {
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

    test('generates a default scope', async function (this: TestContext, assert) {
      let page = create({});

      await this.createTemplate('<p>Lorem ipsum</p>');

      assert.ok(page.contains('ipsum'));
    });

    test('"context" key is not allowed', async function (this: TestContext, assert) {
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

  test('string definition errors', async function (this: TestContext, assert) {
    try {
      // @ts-expect-error violate types to check if it fails in weakly-typed envs
      create('');
      assert.true(false, 'should error');
    } catch (e: any) {
      assert.strictEqual(e.message, 'Definition can not be a string');
    }
  });
});
