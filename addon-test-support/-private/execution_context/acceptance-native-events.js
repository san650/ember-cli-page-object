import { visit } from 'ember-native-dom-helpers';
import ExecutionContext from './native-events-context';
import { chainable } from './utils';
import { wait } from '../compatibility';

export default function AcceptanceNativeEventsExecutionContext(pageObjectNode) {
  ExecutionContext.call(this, pageObjectNode);
}

AcceptanceNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

AcceptanceNativeEventsExecutionContext.prototype.visit = function() {
  visit(...arguments);
  return this.pageObjectNode;
};

AcceptanceNativeEventsExecutionContext.prototype.run = function(helper, onFailure) {
  try {
    return helper()
  } catch(e) {
    onFailure(e);
  }
},

AcceptanceNativeEventsExecutionContext.prototype.runAsync = function(cb) {
  (window.wait || wait)().then(() => {
    cb(this);
  });

  return chainable(this.pageObjectNode);
};
