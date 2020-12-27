import { module, test } from 'qunit';
import require from 'require';
import Rfc268Adapter from 'ember-cli-page-object/adapters/rfc268';
import { setAdapter } from 'ember-cli-page-object/adapters';
import { create, value, visitable } from 'ember-cli-page-object';

if (require.has('@ember/test-helpers')) {
  // intentionally not using our local extension in order to make
  // sure, RFC268 works by default, w/o Adapter being set.
  const { setupApplicationTest } = require('ember-qunit');

  module('Acceptance | rfc268', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function() {
      setAdapter(new Rfc268Adapter);
    })

    hooks.afterEach(function() {
      setAdapter(null);
    })

    let page = create({
      visit: visitable('/calculator'),
      screen: value('.screen input'),
    });

    test('it works', async function(assert) {
      await page.visit();

      assert.equal(page.screen, '');
    });
  });
}
