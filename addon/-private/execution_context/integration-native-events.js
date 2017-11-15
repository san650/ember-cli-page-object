import ExecutionContext from './native-events-context';

import Ember from 'ember';
const { run } = Ember;

export default function IntegrationNativeEventsExecutionContext(pageObjectNode, testContext) {
  ExecutionContext.call(this, pageObjectNode, testContext);
}

IntegrationNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

IntegrationNativeEventsExecutionContext.prototype.visit = function() {};

IntegrationNativeEventsExecutionContext.prototype.runAsync = function(cb) {
  run(() => {
    cb(this);
  });

  return this.pageObjectNode;
};

