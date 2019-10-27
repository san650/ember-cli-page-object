import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { create } from 'ember-cli-page-object';
import { findMany } from 'ember-cli-page-object/extend';
import hbs from 'htmlbars-inline-precompile';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  const { findAll } = require('@ember/test-helpers');

  module(`Extend | findMany`, function(hooks) {
    setupRenderingTest(hooks);

    test('finds by selector and returns array of Elements', async function(assert) {
      let page = create({});

      await this.render(hbs`<em class="lorem"></em><span class="ipsum"></span>`);

      const foundElements = findMany(page, '.lorem', {});

      assert.equal(foundElements.length, 1);
      assert.deepEqual(foundElements, findAll('.lorem'));
    });

    test('finds deeper in scope', async function(assert) {
      let page = create({ scope: '.lorem' });

      await this.render(hbs`
      <em class="lorem"> 
        <span class="dolor"></span> 
        <span class="dolor"></span> 
      </em> 
      <span class="ipsum"> 
        <span class="dolor"></span> 
      </span>
    `);

      const foundElements = findMany(page, '.dolor', {});
      assert.equal(foundElements.length, 2);
      assert.deepEqual(foundElements, findAll('.lorem .dolor'));
    });

    test('returns empty value when no elements found', async function(assert) {
      let page = create({});

      await this.render(hbs`<em class="lorem"></em>`);

      assert.deepEqual(findMany(page, '.ipsum', {}), []);
    });
  });
}
