import { getContext as getIntegrationTestContext } from './helpers';
import { getContext as getEmberTestHelpersContext, visit } from './compatibility';
import AcceptanceExecutionContext from './execution_context/acceptance';
import IntegrationExecutionContext from './execution_context/integration';
import Rfc268Context from './execution_context/rfc268';

const executioncontexts = {
  acceptance: AcceptanceExecutionContext,
  integration: IntegrationExecutionContext,
  rfc268: Rfc268Context
};

/*
 * @private
 */
export function getExecutionContext(pageObjectNode) {
  // Our `getContext(pageObjectNode)` will return a context only if the test
  // called `page.setContext(this)`, which is only supposed to happen in
  // integration tests (i.e. pre-RFC232/RFC268). However, the integration
  // context does work with RFC232 (`setupRenderingContext()`) tests, and before
  // the RFC268 execution context was implemented, some users may have migrated
  // their tests to RFC232 tests, leaving the `page.setContext(this)` in place.
  // So, in order to not break those tests, we need to check for that case
  // first, and only if that hasn't happened, check to see if we're in an
  // RFC232/RFC268 test, and if not, fall back on assuming a pre-RFC268
  // acceptance test, which is the only remaining supported scenario.
  let integrationTestContext = getIntegrationTestContext(pageObjectNode);
  let contextName;
  if (integrationTestContext) {
    contextName = 'integration';
  } else if (isAcceptanceTest()) {
    contextName = 'acceptance';
  } else if (supportsRfc268()) {
    contextName = 'rfc268';
  }

  if (!contextName) {
    throw new Error('Can not detect test type. Please make sure you use the latest version of "@ember/test-helpers".');
  }

  return new executioncontexts[contextName](pageObjectNode, integrationTestContext);
}

/**
 * @private
 */
function isAcceptanceTest() {
  return window.visit && window.andThen;
}

/**
 * @private
 */
export function supportsRfc268() {
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
  let hasValidTestContext = Boolean(getEmberTestHelpersContext());
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

/*
 * @private
 */
export function register(type, definition) {
  executioncontexts[type] = definition;
}
