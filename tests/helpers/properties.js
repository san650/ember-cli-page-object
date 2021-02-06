import ApplicationAdapter from './properties/application-adapter';
import RenderingAdapter from './properties/rendering-adapter';
import {
  setupRenderingTest,
  setupApplicationTest
} from 'ember-qunit'
import { module, test } from 'qunit';

import require from 'require';
import { setAdapter } from 'ember-cli-page-object/test-support/adapters';

export function setupTestModuleForProperty(name, cbOrOptions, cb) {
  let options = cb ? cbOrOptions : {};
  cb = cb || cbOrOptions;

  const Rfc268Adapter = require('ember-cli-page-object/test-support/adapters/rfc268').default;

  module(`Application mode | Property | ${name}`, function(hooks) {
    setupApplicationTest(hooks);

    let adapter = new ApplicationAdapter(hooks);
    hooks.beforeEach(function() {
      this.adapter = adapter;
      setAdapter(new Rfc268Adapter());
    });
    cb(test, 'application');
  });

  if (!options.needsVisit) {
    module(`Rendering mode | Property | ${name}`, function(hooks) {
      setupRenderingTest(hooks);

      let adapter = new RenderingAdapter(hooks);
      hooks.beforeEach(function() {
        this.adapter = adapter;
        setAdapter(new Rfc268Adapter());
      });
      cb(test, 'rendering');
    });
  }
}
