import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers';
import { create, visitable } from 'ember-cli-page-object';
import {
  findElement,
  findElementWithAssert,
} from 'ember-cli-page-object/extend';

type Instance = ReturnType<typeof create>;
module('Acceptance | extends [rfc268]', function (hooks) {
  setupApplicationTest(hooks);

  const page = create({
    visit: visitable('/calculator'),

    findElement(this: Instance, selector: string) {
      return findElement(this, selector);
    },

    findElementWithAssert(this: Instance, selector: string) {
      return findElementWithAssert(this, selector);
    },
  });

  test('finds an element in the DOM', async function (assert) {
    await page.visit();

    let element = page.findElement('.screen');
    assert.ok(element.length);

    element = page.findElementWithAssert('.screen');
    assert.ok(element.length);
  });
});
