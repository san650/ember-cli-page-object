export { findElement } from './-private/extend/find-element';
export { findElementWithAssert } from './-private/extend/find-element-with-assert';
export { buildSelector, getContext, fullScope } from './-private/helpers';
import { register as registerExecutionContext } from './-private/execution_context';

import IntegrationNativeContext from './-private/execution_context/integration-native';
import AcceptanceNativeContext from './-private/execution_context/acceptance-native';
import IntegrationClassicContext from './-private/execution_context/integration';
import AcceptanceClassicContext from './-private/execution_context/acceptance';

function useNativeDOMHelpers(flag = true) {
  if (flag) {
    registerExecutionContext('integration', IntegrationNativeContext);
    registerExecutionContext('acceptance', AcceptanceNativeContext);
  } else {
    registerExecutionContext('integration', IntegrationClassicContext);
    registerExecutionContext('acceptance', AcceptanceClassicContext);
  }
}

export { registerExecutionContext, useNativeDOMHelpers };
