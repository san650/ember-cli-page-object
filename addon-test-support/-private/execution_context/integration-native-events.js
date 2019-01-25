import { run } from '@ember/runloop';
import ExecutionContext from './native-events-context';
import { chainable } from './utils';

export default function IntegrationNativeEventsExecutionContext(pageObjectNode, testContext) {
  ExecutionContext.call(this, pageObjectNode, testContext);
}

IntegrationNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

IntegrationNativeEventsExecutionContext.prototype.visit = function() {};

IntegrationNativeEventsExecutionContext.prototype.run = function(helper, onFailure) {
  try {
    return helper()
  } catch(e) {
    onFailure(e);
  }
};

IntegrationNativeEventsExecutionContext.prototype.runAsync = function(cb) {
  run(() => {
    return cb(this);
  });

  return chainable(this.pageObjectNode);
};
