import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { set } from '@ember/object';

export default class AsyncCalculatorRoute extends Route {
  setupController(...args) {
    const [controller] = args;

    super.setupController(...args);

    later(() => set(controller, 'isPrimeTime', true), 50);
  }
}
