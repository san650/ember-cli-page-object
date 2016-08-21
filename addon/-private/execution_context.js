import { getContext } from './helpers';
import AcceptanceExecutionContext from './execution_context/acceptance';
import IntegrationExecutionContext from './execution_context/integration';

const executioncontexts = {
  acceptance: AcceptanceExecutionContext,
  integration: IntegrationExecutionContext
};

/*
 * @private
 */
export function getExecutionContext(pageObjectNode) {
  let testContext = getContext(pageObjectNode);
  let context = testContext ? 'integration' : 'acceptance';

  return new executioncontexts[context](pageObjectNode, testContext);
}

/*
 * @private
 */
export function register(type, definition) {
  executioncontexts[type] = definition;
}
