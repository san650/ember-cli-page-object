import { test, module } from 'qunit';
import { create, collection } from 'ember-cli-page-object';
import { fullScope } from 'ember-cli-page-object/extend';

module('Unit | helpers | fullScope', function () {
  let page = create({
    scope: '.calculator',

    keyboard: {
      scope: '.keyboard',

      numbers: collection('.numbers button'),
    },
  });

  test('calculates full scope for components', function (assert) {
    assert.equal(fullScope(page), '.calculator');
    assert.equal(fullScope(page.keyboard), '.calculator .keyboard');
    assert.equal(
      fullScope(page.keyboard.numbers[0]),
      '.calculator .keyboard .numbers button:eq(0)'
    );
  });
});
