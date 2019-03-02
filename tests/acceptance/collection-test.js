import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

let page;
moduleForAcceptance('Acceptance | collection', {
  beforeEach() {
    // postpone legacy collection creation in order to
    // avoid deprecation message on tests startup
    page = create({
      visit: visitable('async-calculator'),

      numbers: collection('.numbers button'),

      numbersLegacy: collection({
        itemScope: '.numbers button',
      })
    });
  }
});

test(`allows to traverse nodes while they don't exist`, function(assert) {
  page.visit()
    .numbers
    .objectAt(2)
    .click();

  assert.ok(1, 'exception is not thrown');
});

test(`legacy collection allows to traverse nodes while they don't exist`, function(assert) {
  page.visit()
    .numbersLegacy(2)
    .click();

  assert.ok(1, 'exception is not thrown');
});

