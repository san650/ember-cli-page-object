// requires >= node@13
// should be invoked like `node --es-module-specifier-resolution=node ./node-tests/run-test.js`

import { create, visitable } from 'ember-cli-page-object';
import Adapter from 'ember-cli-page-object/adapter';
import { setAdapter } from 'ember-cli-page-object/adapters';

import jsdom from 'jsdom';

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

setAdapter(new NodeJSAdapter());

const a = create({
  scope: '.test',

  visit: visitable(''),
});

test();

async function test() {
  await a.visit('test/12?param=1');

  console.log('isVisible', a.isVisible);
  console.log('isPresent', a.isPresent);
}
