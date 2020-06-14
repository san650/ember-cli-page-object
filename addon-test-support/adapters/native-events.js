import {
  click,
  triggerEvent,
  keyEvent,
  focus,
  blur
} from 'ember-native-dom-helpers';

import { fillElement, assertFocusable } from './helpers';
import Adapter from "../adapter";

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
    throw new Error('ember-test-helpers or @ember/test-helpers must be installed');
  };
}

const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

export default class NativeEventsAdapter extends Adapter {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext && this.testContext._element ?
      this.testContext._element :
      '#ember-testing';
  }

  wait() {
    return waitFn();
  }

  click(element) {
    click(element);

    return this.wait();
  }

  fillIn(element, content) {

    fillElement(element, content);

    triggerEvent(element, 'input');
    triggerEvent(element, 'change');

    return this.wait();
  }

  triggerEvent(element, eventName, eventOptions) {
    // `keyCode` is a deprecated property.
    // @see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // Due to this deprecation `ember-native-dom-helpers` doesn't accept `keyCode` as a `KeyboardEvent` option.
    if (typeof eventOptions.key === 'undefined' && typeof eventOptions.keyCode !== 'undefined') {
      eventOptions.key = eventOptions.keyCode.toString();
      delete eventOptions.keyCode;
    }

    if (KEYBOARD_EVENT_TYPES.indexOf(eventName) > -1) {
      keyEvent(element, eventName, eventOptions.key, eventOptions);
    } else {
      triggerEvent(element, eventName, eventOptions);
    }

    return this.wait();
  }

  focus(element) {
    assertFocusable(element);

    focus(element);

    return this.wait();
  }

  blur(element) {
    assertFocusable(element);

    blur(element);

    return this.wait();
  }
}
