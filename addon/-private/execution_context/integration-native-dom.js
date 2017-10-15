import ExecutionContext from './native-dom-context';

import Ember from 'ember';
const { run } = Ember;

export default function IntegrationExecutionContext(pageObjectNode, testContext) {
  ExecutionContext.call(this, pageObjectNode, testContext);
}

IntegrationExecutionContext.prototype = Object.create(ExecutionContext.prototype);

IntegrationExecutionContext.prototype.visit = function() {};

IntegrationExecutionContext.prototype.runAsync = function(cb) {
  run(() => {
    cb(this);
  });

  return this.pageObjectNode;
};
