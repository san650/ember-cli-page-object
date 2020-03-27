import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  create,
  visitable
} from 'ember-cli-page-object';
import {
  findElementWithAssert
} from 'ember-cli-page-object/extend';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  module('Acceptance | extends [rfc268]', function(hooks) {
    setupApplicationTest(hooks);

    let page = create({
      visit: visitable('/calculator'),

      findElementWithAssert(this: any, selector: string) {
        return findElementWithAssert(this, selector);
      }
    });

    test('finds an element in the DOM', async function(assert) {
      await page.visit();

      let element = page.findElementWithAssert('.screen');
      assert.ok(element.length);
    });
  });
}
