import { visit } from 'ember-native-dom-helpers';
import Adapter from './native-events';

export default class AcceptanceNativeEventsAdapter extends Adapter {
  visit() {
    visit(...arguments);

    return this.wait();
  }

  wait() {
    return (window.wait || super.wait)();
  }
}
