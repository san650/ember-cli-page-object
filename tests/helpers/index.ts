import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
} from 'ember-qunit';

import { setAdapter, RFC268Adapter } from 'ember-cli-page-object';

export function setupApplicationTest(hooks: NestedHooks) {
  upstreamSetupApplicationTest(hooks);

  hooks.beforeEach(function() {
    debugger
    setAdapter(new RFC268Adapter());
  });

  hooks.afterEach(function() {
    document.getElementById('alternate-ember-testing')!.innerHTML = '';
  })
}

export function setupRenderingTest(hooks: NestedHooks) {
  upstreamSetupRenderingTest(hooks);

  hooks.beforeEach(function() {
    setAdapter(new RFC268Adapter());
  });

  hooks.afterEach(function() {
    document.getElementById('alternate-ember-testing')!.innerHTML = '';
  })
}

export { setupTest } from 'ember-qunit';
