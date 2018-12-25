export { findElement } from './find-element';
export { findElementWithAssert } from './find-element-with-assert';
export { buildSelector, getContext, fullScope } from '../-private/helpers';
import {
  register as registerExecutionContext
} from '../-private/execution_context';

import NativeEventsContext from '../-private/execution_context/native-events-context';
import IntegrationEmberContext from '../-private/execution_context/integration';
import AcceptanceEmberContext from '../-private/execution_context/acceptance';

function useNativeEvents(flag = true) {
  if (flag) {
    registerExecutionContext('integration', NativeEventsContext);
    registerExecutionContext('acceptance', NativeEventsContext);
  } else {
    registerExecutionContext('integration', IntegrationEmberContext);
    registerExecutionContext('acceptance', AcceptanceEmberContext);
  }
}

export { registerExecutionContext, useNativeEvents };
