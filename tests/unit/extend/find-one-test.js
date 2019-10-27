import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { create } from 'ember-cli-page-object';
import { findOne } from 'ember-cli-page-object/extend';
import hbs from 'htmlbars-inline-precompile';

import require from 'require';

if (require.has('@ember/test-helpers')) {
  const { find } = require('@ember/test-helpers');

  module(`Extend | findOne`, function(hooks) {
    setupRenderingTest(hooks);

    test('finds by selector and returns Element', async function(assert) {
      let page = create({});

      await this.render(hbs`<em class="lorem"></em><span class="ipsum"></span>`);

      assert.equal(findOne(page, '.lorem', {}), find('.lorem'));
    });

    test('finds deeper in scope', async function(assert) {
      let page = create({ scope: '.lorem' });

      await this.render(hbs`<em class="lorem"><span class="dolor"></span></em><span class="ipsum"><span class="dolor"></span></span>`);

      assert.equal(findOne(page, '.dolor', {}), find('.lorem .dolor'));
    });

    test('throws error if more than 1 element found', async function(assert) {
      let page = create({});

      await this.render(hbs`<em class="lorem"></em><em class="lorem"></em><span class="ipsum"></span>`);

      assert.throws(() => findOne(page, '.lorem', {}),
        /Error: Assertion Failed: ".lorem" matched more than one element. If this is not an error use { multiple: true }/);
    });

    test('throws error if 0 elements found', async function(assert) {
      let page = create({});

      await this.render(hbs`<span class="ipsum"></span>`);

      assert.throws(() => findOne(page, '.unknown', {}),
        /Error: Element not found./);
    });
  });
}
