import { module, test } from 'qunit';
import {
  setAdapter,
  create,
  value,
  visitable,
  RFC268Adapter,
} from 'ember-cli-page-object';
import { setupApplicationTest } from '../helpers';

module('Acceptance | rfc268', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    setAdapter(new RFC268Adapter());
  });

  hooks.afterEach(function () {
    setAdapter(null);
  });

  let page = create({
    visit: visitable('/calculator'),
    screen: value('.screen input'),
  });

  test('it works', async function (assert) {
    await page.visit();

    assert.equal(page.screen, '');
  });
});
