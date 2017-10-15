import { getContext } from './helpers';
import AcceptanceEmberExecutionContext from './execution_context/acceptance';
import IntegrationEmberExecutionContext from './execution_context/integration';

const executioncontexts = {
  acceptance: AcceptanceEmberExecutionContext,
  integration: IntegrationEmberExecutionContext
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
