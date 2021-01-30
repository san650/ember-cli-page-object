import require from 'require';

/* global Ember */
/* eslint-disable ember/new-module-imports */
let { $ } = Ember;

if (typeof $ !== 'function') {
  $ = require('jquery').default;
}

export { $ }
