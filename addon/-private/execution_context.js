import { getContext } from './helpers';
import { getContext as getTestContext } from '@ember/test-helpers'
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
  let testContext = getContext(pageObjectNode);
  let context;
  if (testContext) {
    context = 'integration';
  } else if (getTestContext()) {
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
