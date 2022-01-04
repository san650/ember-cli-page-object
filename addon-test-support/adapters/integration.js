/* global Ember */
/* eslint-disable ember/new-module-imports */
const { $ } = Ember;

import { fillElement, assertFocusable } from './helpers';
import Adapter from '../adapter';

const { require } = window;
let waitFn;
if (require.has('ember-test-helpers/wait')) {
  // This is implemented as a function that calls `ember-test-helpers/wait`
  // rather than just assigning `helpers.wait = require(...).default` because
  // since this code executes while modules are initially loading, under certain
  // conditions `ember-test-helpers/wait` can still be in the pending state
  // at this point, so its exports are still undefined.
  waitFn = (...args) => require('ember-test-helpers/wait').default(...args);
} else {
  waitFn = () => {
    throw new Error(
      'ember-test-helpers or @ember/test-helpers must be installed'
    );
  };
}

export default class IntegrationAdapter extends Adapter {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext && this.testContext._element
      ? this.testContext._element
      : '#ember-testing';
  }

  wait() {
    return waitFn();
  }

  click(element) {
    $(element).click();

    return this.wait();
  }

  fillIn(element, content) {
    fillElement(element, content);

    $(element).trigger('input');
    $(element).change();

    return this.wait();
  }

  triggerEvent(element, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    $(element).trigger(event);

    return this.wait();
  }

  focus(element) {
    assertFocusable(element);

    $(element).focus();

    return this.wait();
  }

  blur(element) {
    assertFocusable(element);

    $(element).blur();

    return this.wait();
  }
}
