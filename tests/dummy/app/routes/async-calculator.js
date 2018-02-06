import Ember from 'ember';

import {
  later
} from '@ember/runloop';

import {
    set
} from '@ember/object';

export default Ember.Route.extend({
    setupController(controller) {
        this._super(...arguments);

        later(() => set(controller, 'isPrimeTime', true), 50);
    }
});
