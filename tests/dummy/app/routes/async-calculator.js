import Route from '@ember/routing/route';

import {
  later
} from '@ember/runloop';

import {
    set
} from '@ember/object';

export default Route.extend({
    setupController(controller) {
        this._super(...arguments);

        later(() => set(controller, 'isPrimeTime', true), 50);
    }
});
