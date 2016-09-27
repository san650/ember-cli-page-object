import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { create, collection, fullScope } from 'ember-cli-page-object';

moduleForAcceptance('Acceptance | utils');

let page = create({
  scope: '.calculator',

  keyboard: {
    scope: '.keyboard',

    numbers: collection({
      scope: '.numbers',

      itemScope: 'button'
    })
  }
});

test('calculates full scope for components', function(assert) {
  assert.equal(fullScope(page), '.calculator');
  assert.equal(fullScope(page.keyboard), '.calculator .keyboard');
  assert.equal(fullScope(page.keyboard.numbers(0)), '.calculator .keyboard .numbers button:eq(0)');
});
