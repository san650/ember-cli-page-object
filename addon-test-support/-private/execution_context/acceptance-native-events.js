import { visit } from 'ember-native-dom-helpers';

import ExecutionContext from './native-events-context';
import { wait } from '../compatibility';

export default class AcceptanceNativeEventsExecutionContext extends ExecutionContext {
  visit() {
    visit(...arguments);
    return this.pageObjectNode;
  }

  runAsync(cb) {
    (window.wait || wait)().then(() => {
      cb(this);
    });

    return this.chainable();
  }
}
