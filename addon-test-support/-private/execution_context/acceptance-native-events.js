import { visit } from 'ember-native-dom-helpers';
import ExecutionContext from './native-events-context';
import { wait } from '../compatibility';

export default function AcceptanceNativeEventsExecutionContext(pageObjectNode) {
  ExecutionContext.call(this, pageObjectNode);
}

AcceptanceNativeEventsExecutionContext.prototype = Object.create(ExecutionContext.prototype);

AcceptanceNativeEventsExecutionContext.prototype.visit = function() {
  visit(...arguments);
};

AcceptanceNativeEventsExecutionContext.prototype.andThen = function(cb) {
  return (window.wait || wait)().then(() => {
    cb(this);
  });
}
