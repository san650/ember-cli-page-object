import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers';

import { create, collection, visitable } from 'ember-cli-page-object';

const page = create({
  visit: visitable('async-calculator'),

  numbers: collection('.numbers button'),
});

module('Acceptance | collection', function (hooks) {
  setupApplicationTest(hooks);

  test(`allows to traverse nodes while they don't exist`, async function (assert) {
    await page.visit().numbers[2]?.click();

    assert.ok(1, 'exception is not thrown');
  });
});
