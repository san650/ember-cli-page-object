import { module, test } from 'qunit';
import require from 'require';
import { setAdapter } from 'ember-cli-page-object/adapters';
import { create, value, visitable } from 'ember-cli-page-object';

if (require.has('@ember/test-helpers')) {
  const { setupApplicationTest } = require('ember-qunit');

  const Rfc268Adapter = require('ember-cli-page-object/adapters/rfc268').default;

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
