import { test, module } from 'qunit';
import { create, collection, property } from 'ember-cli-page-object';
import { setupRenderingTest } from '../helpers';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { QuerySelector } from 'ember-cli-page-object/-private/query/selector';

module('Integration | custom query selectors', function (hooks) {
  setupRenderingTest(hooks);

  test('custom scope', async function (assert) {
    const invocations = [];

    class CSSQuerySelector extends QuerySelector {
      query(containerElement) {
        const { selector } = this;

        invocations.push(selector);

        return Array.from(containerElement.querySelectorAll(selector));
      }
    }

    const css = (selector) => {
      return new CSSQuerySelector(selector);
    };

    const page = create({
      scope: css('li'),
    });

    assert.ok(page.scope instanceof CSSQuerySelector);
  });

  test('it works', async function (assert) {
    const invocations = [];

    class CSSQuerySelector extends QuerySelector {
      query(containerElement) {
        const { selector } = this;

        invocations.push(selector);

        return Array.from(containerElement.querySelectorAll(selector));
      }
    }

    const css = (selector) => {
      return new CSSQuerySelector(selector);
    };

    const page = create({
      scope: css('ul'),

      items: collection(css('li'), {
        id: property('id'),
      }),
    });

    await render(hbs`
    <div>
      <ul>
        <li id="a"></li>
        <li id="b"></li>
        <li id="c"></li>
      </ul>

      <ol>
        <li id="d"></li>
        <li id="e"></li>
        <li id="f"></li>
      </ol>
    </div>`);

    assert.strictEqual(page.items.length, 3);
    assert.deepEqual(
      invocations,
      ['ul', 'li'],
      'elements are searched one by one'
    );

    assert.deepEqual(
      page.items.map((item) => item.id),
      ['a', 'b', 'c']
    );
  });

  test('concat', async function (assert) {
    const invocations = [];

    class CSSQuerySelector extends QuerySelector {
      query(containerElement) {
        const { selector } = this;

        invocations.push(selector);

        return Array.from(containerElement.querySelectorAll(selector));
      }

      canConcat() {
        return true;
      }

      concat(querySelector) {
        return new CSSQuerySelector(
          `${this.selector} ${querySelector.selector}`
        );
      }
    }

    const css = (selector) => {
      return new CSSQuerySelector(selector);
    };

    const page = create({
      scope: css('ul'),

      items: collection(css('li'), {
        id: property('id'),
      }),
    });

    await render(hbs`
    <div>
      <ul>
        <li id="a"></li>
        <li id="b"></li>
        <li id="c"></li>
      </ul>

      <ol>
        <li id="d"></li>
        <li id="e"></li>
        <li id="f"></li>
      </ol>
    </div>`);

    assert.strictEqual(page.items.length, 3);
    assert.deepEqual(invocations, ['ul li'], 'elements are searched in one go');
    assert.deepEqual(
      page.items.map((item) => item.id),
      ['a', 'b', 'c']
    );
  });
});
