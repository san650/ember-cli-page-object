import { run } from '@ember/runloop';
import ExecutionContext from './native-events-context';

export default class IntegrationNativeEventsExecutionContext extends ExecutionContext {
  constructor(pageObjectNode, testContext) {
    super(pageObjectNode);

    this.testContext = testContext;
  }

  visit() {}

  runAsync(cb) {
    run(() => {
      cb(this);
    });

    return this.chainable();
  }
}
