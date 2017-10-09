import ExecutionContext from './native-dom-context';

import {
  visit
} from 'ember-native-dom-helpers';

export default function AcceptanceExecutionContext(pageObjectNode) {
  ExecutionContext.call(this, pageObjectNode);
}

AcceptanceExecutionContext.prototype = Object.create(ExecutionContext.prototype);

AcceptanceExecutionContext.prototype.visit = function() {
  return visit(...arguments);
};

AcceptanceExecutionContext.prototype.runAsync = function(cb) {
  window.wait().then(() => {
    cb(this);
  });

  return this.pageObjectNode;
};
