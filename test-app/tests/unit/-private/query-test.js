import { test, module } from 'qunit';
import { create, collection } from 'ember-cli-page-object';
import { Query } from 'ember-cli-page-object/-private/query';
import { setupRenderingTest } from '../../helpers';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Unit | -private/query', function () {
  module('toString()', function () {
    test('it works', function (assert) {
      const q = new Query();
      assert.equal(q.toString(), ':first-child:eq(0)');
    });

    test('respects node scope', function (assert) {
      const page = create({
        scope: '.selector',
      });

      const q = new Query(page);
      assert.equal(q.toString(), '.selector');
    });

    test('scope as a getter', function (assert) {
      const page = create({
        get scope() {
          return {
            selector: '.selector',
            at: 2,
          };
        },
      });

      const q = new Query(page);
      assert.equal(q.toString(), '.selector:eq(2)');
    });

    module('locator', function () {
      test('accepts string', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, '.child');
        assert.equal(q.toString(), '.selector .child');
      });

      test('selector', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          selector: '.child',
        });

        assert.equal(q.toString(), '.selector .child');
      });

      test('at', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          at: 9,
        });

        assert.equal(q.toString(), '.selector:eq(9)');
      });

      test('last', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          last: true,
        });

        assert.equal(q.toString(), '.selector:last');
      });

      test('visible', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          visible: true,
        });

        assert.equal(q.toString(), '.selector:visible');
      });

      test('contains', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q = new Query(page, {
          contains: 'some text',
        });

        assert.equal(q.toString(), '.selector:contains("some text")');
      });

      test('respects resetScope', function (assert) {
        const page = create({
          scope: '.selector',
        });

        const q1 = new Query(page, {
          selector: '.independent-selector',
          resetScope: true,
        });

        assert.equal(q1.toString(), '.independent-selector');

        const q2 = new Query(page, {
          resetScope: true,
        });

        assert.equal(q2.toString(), '.selector');
      });
    });
  });

  module('all', function (hooks) {
    setupRenderingTest(hooks);

    test('it works', async function (assert) {
      const page = create({
        scope: 'ul',
        collection: collection('li', {
          title: {
            scope: 'h5',
          },
        }),
      });

      const q = new Query(page.collection[1].title, {});

      await render(hbs`<ul>
        <li>
          <h5>1</h5>
        </li>
        <li>
          <h5>2</h5>
        </li>
      </ul>`);

      assert.strictEqual(q.all().length, 1);
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

      const q = new Query(page.collection[1].title, {});

      await this.createTemplate(
        `<ul>
        <li>
          <h5>1</h5>
        </li>
        <li>
          <h5>2</h5>
        </li>
      </ul>`,
        {
          useAlternateContainer: true,
        }
      );

      assert.strictEqual(q.all().length, 1);
    });
  });
});
