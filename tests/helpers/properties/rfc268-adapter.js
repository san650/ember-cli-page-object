
export { test as testForAcceptance } from 'qunit';

import $ from 'jquery';
import { settled } from '@ember/test-helpers';

export default function Rfc268Adapter() {}

Rfc268Adapter.prototype = {
  $(selector, isAlternative) {
    return $(selector, isAlternative ? '#alternate-ember-testing' : '#ember-testing');
  },

  async throws(assert, block, expected, message) {
    let error;

    try {
      await block();
    } catch (e) {
      error = e;
    }

    assert.throws(() => {
      if (error) {
        throw error;
      }
    }, expected, message);
  },

  async wait() {
    await settled();
  },

  async await(res) {
    await res;
  }
};
