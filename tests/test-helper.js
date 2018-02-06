//
// We run our tests using the RFC232/268 test API, which uses methods only
// present in a fairly new `ember-qunit`. But when we run the
// `with-ember-test-helpers` `ember-try` scenario, those methods aren't present.
// So, we detect if `@ember/test-helpers` is present, meaning we can use the
// new APIs, and if so require `new-test-helper`, which is just the new
// blueprint version of `test-helper.js`. If it's not present, we use
// `legacy-test-helper`, which is the old blueprint version of `test-helper.js`.
// If we're using the old version, it also needs `../helpers/legacy-resolver.js`
// which is just a copy of `resolver.js` (which was deleted from the blueprint,
// so doesn't have a new version).
//
import require from 'require';

if (require.has('@ember/test-helpers')) {
  require('./new-test-helper');
} else {
  require('./legacy-test-helper');
}
