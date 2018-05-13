import { run } from '@ember/runloop';
import NativeEventsExecutionContext from './native-events-context';

export default class IntegrationNativeEventsExecutionContext extends NativeEventsExecutionContext {
  visit() {}

  runAsync(cb) {
    run(() => {
      cb(this);
    });

    return this.chainable();
  }
}
