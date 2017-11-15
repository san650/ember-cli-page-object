import ExecutionContext from './native-events-context';
import wait from 'ember-test-helpers/wait';

import {
  visit
} from 'ember-native-dom-helpers';

export default function AcceptanceNativeEventsExecutionContext(pageObjectNode) {
  ExecutionContext.call(this, pageObjectNode);
}

AcceptanceNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

AcceptanceNativeEventsExecutionContext.prototype.visit = function() {
  return visit(...arguments);
};

AcceptanceNativeEventsExecutionContext.prototype.runAsync = function(cb) {
  (window.wait || wait)().then(() => {
    cb(this);
  });

  return this.pageObjectNode;
};

