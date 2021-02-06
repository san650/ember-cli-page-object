import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
} from 'ember-qunit';

// @ts-ignore
import { setAdapter } from 'ember-cli-page-object/test-support/adapters';
import Rfc268Adapter from 'ember-cli-page-object/adapters/rfc268';

export function setupApplicationTest(hooks: NestedHooks) {
  upstreamSetupApplicationTest(hooks);

  hooks.beforeEach(function() {
    setAdapter(new Rfc268Adapter());
  });
}

export function setupRenderingTest(hooks: NestedHooks) {
  upstreamSetupRenderingTest(hooks);

  hooks.beforeEach(function() {
    setAdapter(new Rfc268Adapter());
  });
}

export { setupTest } from 'ember-qunit';
