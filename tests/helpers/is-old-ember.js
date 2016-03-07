import Ember from 'ember';

// Takes a component test context and returns true if
// the Ember version is 1.12.x. This lets us use the old
// syntax for rendering component templates in integration
// tests when an older version of Ember is used.
//
// This is necessary in order for tests to pass with ember-try.
export const isOldEmber = (function() {
  const versionSplit = Ember.VERSION.split('.');
  const majorVersion = parseInt(versionSplit[0], 10);
  const minorVersion = parseInt(versionSplit[1], 10);

  return majorVersion === 1 && minorVersion < 13;
})();
