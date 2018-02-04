export const wait = (function() {
  const hasLegacyEmberTestHelpers = window.require.has('ember-test-helpers');
  const hasLatestEmberTestHelpers = window.require.has('@ember/test-helpers');

  if (!hasLegacyEmberTestHelpers && !hasLatestEmberTestHelpers) {
    return function() {
      throw new Error('ember-test-helpers or @ember/test-helpers must be installed');
    }
  }

  return window.require('ember-test-helpers/wait')['default'];
})();
