export { findElement } from './-private/extend/find-element';
export { findElementWithAssert } from './-private/extend/find-element-with-assert';
export { buildSelector, getContext, fullScope } from './-private/helpers';
import { register as registerExecutionContext } from './-private/execution_context';

import IntegrationNativeDOMContext from './-private/execution_context/integration-native-dom';
import AcceptanceNativeDOMContext from './-private/execution_context/acceptance-native-dom';
import IntegrationEmberContext from './-private/execution_context/integration';
import AcceptanceEmberContext from './-private/execution_context/acceptance';

function useNativeDOMHelpers(flag = true) {
  if (flag) {
    registerExecutionContext('integration', IntegrationNativeDOMContext);
    registerExecutionContext('acceptance', AcceptanceNativeDOMContext);
  } else {
    registerExecutionContext('integration', IntegrationEmberContext);
    registerExecutionContext('acceptance', AcceptanceEmberContext);
  }
}

export { registerExecutionContext, useNativeDOMHelpers };
