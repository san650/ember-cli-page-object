import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
} from 'ember-qunit';

import { setAdapter } from 'ember-cli-page-object/test-support/adapters';

export function setupApplicationTest(hooks: NestedHooks) {
  const Rfc268Adapter = requireRfc268Adapter();

  upstreamSetupApplicationTest(hooks);

  hooks.beforeEach(function() {
    setAdapter(new Rfc268Adapter());
  });

  hooks.afterEach(function() {
    document.getElementById('alternate-ember-testing')!.innerHTML = '';
  })
}

export function setupRenderingTest(hooks: NestedHooks) {
  const Rfc268Adapter = requireRfc268Adapter();

  upstreamSetupRenderingTest(hooks);

  hooks.beforeEach(function() {
    setAdapter(new Rfc268Adapter());
  });

  hooks.afterEach(function() {
    document.getElementById('alternate-ember-testing')!.innerHTML = '';
  })
}

function requireRfc268Adapter() {
  const { require } = window;
  const hasRfc268 = ( require as any).has('@ember/test-helpers');

  if (!hasRfc268) {
    throw new Error(`"@ember/test-helpers" not installed.`)
  }

  return require('ember-cli-page-object/test-support/adapters/rfc268').default;
}

export { setupTest } from 'ember-qunit';
