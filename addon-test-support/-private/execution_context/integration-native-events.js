import { run } from '@ember/runloop';
import ExecutionContext from './native-events-context';
import wait from 'ember-test-helpers/wait';

export default function IntegrationNativeEventsExecutionContext(pageObjectNode, testContext) {
  ExecutionContext.call(this, pageObjectNode, testContext);
}

IntegrationNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

IntegrationNativeEventsExecutionContext.prototype.visit = function() {};

IntegrationNativeEventsExecutionContext.prototype.andThen = function(cb) {
  run(() => {
    cb(this);
  });

  return wait();
};
