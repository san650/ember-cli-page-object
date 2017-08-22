export { findElement } from './-private/extend/find-element';
export { findElementWithAssert } from './-private/extend/find-element-with-assert';
export { buildSelector, getContext, fullScope } from './-private/helpers';
import { register as registerExecutionContext } from './-private/execution_context';

import IntegrationNativeContext from './-private/execution_context/integration-native';
import AcceptanceNativeContext from './-private/execution_context/acceptance-native';

function useNativeDOMHelpers() {
  registerExecutionContext('integration', IntegrationNativeContext);
  registerExecutionContext('acceptance', AcceptanceNativeContext);
}

export { registerExecutionContext, useNativeDOMHelpers };
