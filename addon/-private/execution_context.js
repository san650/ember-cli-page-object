import { getContext } from './helpers';
import isRfc268Test from './is-rfc268-test';
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
  let testContext = getContext(pageObjectNode);
  let context;
  if (testContext) {
    context = 'integration';
  } else if (isRfc268Test()) {
    context = 'rfc268';
  } else {
    context = 'acceptance';
  }

  return new executioncontexts[context](pageObjectNode, testContext);
}

/*
 * @private
 */
export function register(type, definition) {
  executioncontexts[type] = definition;
}
