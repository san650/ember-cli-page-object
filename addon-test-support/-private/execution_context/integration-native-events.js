import { run } from '@ember/runloop';
import ExecutionContext from './native-events-context';
import { chainable } from './utils';

export default function IntegrationNativeEventsExecutionContext(pageObjectNode, testContext) {
  ExecutionContext.call(this, pageObjectNode, testContext);
}

IntegrationNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

IntegrationNativeEventsExecutionContext.prototype.visit = function() {};

IntegrationNativeEventsExecutionContext.prototype.runAsync = function(cb) {
  run(() => {
    cb(this);
  });

  return chainable(this.pageObjectNode);
};
