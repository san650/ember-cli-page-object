import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import {
  create,
  visitable
} from 'ember-cli-page-object';

import {
  findElementWithAssert
} from 'ember-cli-page-object/extend';

moduleForAcceptance('Acceptance | extends');

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
