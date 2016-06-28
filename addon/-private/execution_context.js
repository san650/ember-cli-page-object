import { getContext } from '../helpers';
import AcceptanceExecutionContext from './execution_context/acceptance';
import IntegrationExecutionContext from './execution_context/integration';

export function getExecutionContext(pageObjectNode) {
  let testContext = getContext(pageObjectNode);

  if (testContext) {
    return new IntegrationExecutionContext(pageObjectNode, testContext);
  } else {
    return new AcceptanceExecutionContext(pageObjectNode);
  }
}
