//
// This is a wrapper around `@ember/test-helpers` that we need for compatibility
// reasons. Apps and addons aren't supposed to depend directly on
// `@ember/test-helpers`, but just use the one that their version of
// `ember-qunit` or `ember-mocha` provides. This compatibility module does three
// jobs for us:
//
// 1. Helps us determine if we are running an RFC232/268 test or not
// 2. Provides the test helpers needed to run RFC232/268 tests
// 3. Provides a `wait` implementation for non-RFC232/268 (legacy) tests
//
// To accomplish (1) and (2) we need to determine if `@ember/test-helpers` is
// present. If it isn't, we can't possibly be running RFC232/268 tests because
// they rely on it. If it is, then we need its `getContext()` method to see if
// any of the the RFC232/268 setup methods have been called. So, to keep this
// complexity encapsulated in this file, if `@ember/test-helpers` is not
// present, we export a stub `getContext()` function that returns null,
// indicating that we are not running RFC232/268 tests, and then the rest of the
// addon code won't try to access any of the other `@ember/test-helpers`
// helpers.
//
// To accomplish (3), we need to determine if `ember-test-helpers` is present.
// Because it's built with legacy support, anytime `@ember/test-helpers` is
// present, `ember-test-helpers` will also be present. So we can check for
// `ember-test-helpers/wait` and export it if present. If it's not present, we
// don't want to throw an exception immediately because acceptance tests don't
// need it, so we export a `wait` function that throws an exception if and when
// it's called.
//
// Once we drop support for pre-RFC268 tests, including all calls to `wait`, we
// can delete this file and import `@ember/test-helpers` directly.
//

// When a module imports `require`, it gets a dynamically generated module that
// handles relative imports correctly, so there's no way to get at it to stub it
// from another module/test. So instead we use the global require, which is only
// available via window.require, so our tests can stub it out.
const { require } = window;

let helpers;
let waitFn;

if (require.has('@ember/test-helpers')) {
  helpers = require('@ember/test-helpers');
} else {
  helpers = {
    getContext() {
      return null;
    }
  };
}

if (require.has('ember-test-helpers/wait')) {
  // This is implemented as a function that calls `ember-test-helpers/wait`
  // rather than just assigning `helpers.wait = require(...).default` because
  // since this code executes while modules are initially loading, under certain
  // conditions `ember-test-helpers/wait` can still be in the pending state
  // at this point, so its exports are still undefined.
  waitFn = (...args) => require('ember-test-helpers/wait').default(...args);
} else {
  waitFn = () => {
    throw new Error('ember-test-helpers or @ember/test-helpers must be installed');
  };
}

export function getContext(...args) {
  return helpers.getContext(...args);
}
export function visit(...args) {
  return helpers.visit(...args);
}
export function click(...args) {
  return helpers.click(...args);
}
export function fillIn(...args) {
  return helpers.fillIn(...args);
}
export function triggerEvent(...args) {
  return helpers.triggerEvent(...args);
}
export function triggerKeyEvent(...args) {
  return helpers.triggerKeyEvent(...args);
}
export function focus(...args) {
  return helpers.focus(...args);
}
export function blur(...args) {
  return helpers.blur(...args);
}
export let wait = waitFn;
