import NativeEventsExecutionContext from './native-events-context';

import { wait } from '../compatibility';
import { visit } from 'ember-native-dom-helpers';

export default class AcceptanceNativeEventsExecutionContext extends NativeEventsExecutionContext {

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
