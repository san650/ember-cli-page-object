import { module, test } from 'qunit';
import { create, value, visitable } from 'ember-cli-page-object';
import { setupApplicationTest } from '../helpers';

module('Acceptance | rfc268', function (hooks) {
  setupApplicationTest(hooks);

  const page = create({
    visit: visitable('/calculator'),
    screen: value('.screen input'),
  });

  test('it works', async function (assert) {
    await page.visit();

    assert.equal(page.screen, '');
  });
});
