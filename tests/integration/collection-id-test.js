import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { create, collection, attribute } from 'ember-cli-page-object';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  const { render } = require('@ember/test-helpers')

  const page = create({
    items: collection('ul>li', {
      id: attribute('data-test-uuid')
    })
  });

  const { items } = page;

  module('Integration | collection id', function(hooks) {
    setupRenderingTest(hooks);

    test('getById works', async function(assert) {
      await render(hbs`<ul>
        <li data-test-uuid="uuid1">UUID1</li>
        <li data-test-uuid="uuid2">UUID2</li>
      </ul>`);

      const first = items.getById('uuid1');
      assert.equal(first.text, 'UUID1');
    });

    test('enumerating by id works', async function(assert) {
      await render(hbs`<ul>
        <li data-test-uuid="uuid1">UUID1</li>
        <li data-test-uuid="uuid2">UUID2</li>
      </ul>`);

      const { uuid1 } = items;
      assert.equal(uuid1.text, 'UUID1');
    });
  });
}
