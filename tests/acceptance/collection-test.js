import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

const page = create({
  visit: visitable('async-calculator'),

  numbers: collection('.numbers button'),
});

moduleForAcceptance('Acceptance | collection');

test(`allows to traverse nodes while they don't exist`, function(assert) {
  page.visit()
    .numbers
    .objectAt(2)
    .click();

  assert.ok(1, 'exception is not thrown');
});
