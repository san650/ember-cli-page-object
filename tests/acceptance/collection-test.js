import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';
import { setupTestModuleForProperty } from '../helpers/properties';

const page = create({
  visit: visitable('async-calculator'),

  numbers: collection('.numbers button'),
});

setupTestModuleForProperty('Acceptance | collection', { needsVisit: true }, function(test) {
  test(`allows to traverse nodes while they don't exist`, async function(assert) {
    await page.visit()
      .numbers
      .objectAt(2)
      .click();

    assert.ok(1, 'exception is not thrown');
  });
});
