// requires >= node@13
// should be invoked like `node --es-module-specifier-resolution=node ./node-tests/run-test.js`

import { create, visitable } from 'ember-cli-page-object';
import Adapter from 'ember-cli-page-object/adapter';
import { setAdapter } from 'ember-cli-page-object/adapters';
import jsdom from 'jsdom';
import QUnit from 'qunit';
const { module, test } = QUnit;

const RESPONSE_FIXTURE = `<html>
  <body>
    <div class="test"></div>
  </body>
</html>`;

class NodeJSAdapter extends Adapter {
  visit() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { JSDOM } = jsdom;
        const { window } = (new JSDOM(RESPONSE_FIXTURE));

        this.window = window;

        resolve();
      }, 1000)
    })
  }

  get testContainer() {
    return this.window.document;
  }
}

module('node.js', function(hooks) {
  hooks.beforeEach(function() {
    setAdapter(new NodeJSAdapter());
  });

  test('it works!', async function(assert) {
    const a = create({
      scope: '.test',

      visit: visitable(''),
    });

    await a.visit();

    assert.strictEqual(a.isVisible, false);
    assert.strictEqual(a.isPresent, true);
  });
});
