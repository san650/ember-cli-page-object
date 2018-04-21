import { getContext, visit } from './compatibility';

export default function isRfc268Test() {
  // `getContext()` returns:
  //  - falsey, if @ember/test-helpers is not available (stubbed in
  //    compatibility.js)
  //  - falsey, if @ember/test-helpers is available but none of the
  //    `ember-qunit` setupTest() methods has been called (e.g.,
  //    `setupRenderingTest()`)
  //  - truthy, if @ember/test-helpers is available and one of the `ember-qunit`
  //    setupTest() methods has been called.
  //
  // Note that if `page.setContext(this)` has been called, we'll never get here
  // and will just be running with the integration context (even if the test is
  // an RFC268 test).
  let hasValidTestContext = Boolean(getContext());
  if (!hasValidTestContext) {
    return false;
  }

  // There are a few versions of `@ember/test-helpers` that have support for
  // `ember-qunit`'s `setupRenderingTest()` method, but do not have the DOM
  // helpers (`click`, `fillIn`, etc.) that the RFC268 execution context uses.
  // `visit` was the last helper to be added to `@ember/test-helpers`, so we
  // check for it, and if we can't find it, we can't use the RFC268 execution
  // context, so we throw an exception.
  let hasExpectedTestHelpers = Boolean(visit);
  if (!hasExpectedTestHelpers) {
    throw new Error([
      'You are trying to use ember-cli-page-object with RFC232/RFC268 support',
      '(setupRenderingContext()/setupApplicationContext()) which requires at',
      'least ember-qunit@3.2.0 or ember-mocha@0.13.0-beta.3.'
    ].join());
  }

  return true;
}
