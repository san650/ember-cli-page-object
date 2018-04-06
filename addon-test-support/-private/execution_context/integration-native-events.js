import { run } from '@ember/runloop';
import ExecutionContext from './native-events-context';

export default function IntegrationNativeEventsExecutionContext(pageObjectNode, testContext) {
  ExecutionContext.call(this, pageObjectNode, testContext);
}

IntegrationNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

IntegrationNativeEventsExecutionContext.prototype.visit = function() {};

IntegrationNativeEventsExecutionContext.prototype.runAsync = function(cb) {
  run(() => {
    cb(this);
  });

  return this.chainable();
};
