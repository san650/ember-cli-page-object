import {
  click,
  triggerEvent,
  keyEvent,
  focus,
  blur
} from 'ember-native-dom-helpers';

import {
  fillElement,
  assertFocusable
} from './helpers';

import ExecutionContext from './execution-context'

const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

export default class NativeEventsExecutionContext extends ExecutionContext {
  run(cb) {
    return cb(this);
  }

  runAsync() {
    throw new Error('not implemented');
  }

  chainable() {
    return this.pageObjectNode;
  }

  click(selector, testContainer) {
    this.invokeHelper(selector, { testContainer }, click);
  }

  fillIn(selector, testContainer, options, content) {
    let elements = this.getElements(selector, { testContainer }).toArray();

    elements.forEach((el) => {
      fillElement(el, content, {
        selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      triggerEvent(el, 'input');
      triggerEvent(el, 'change');
    });
  }

  triggerEvent(selector, testContainer, options, eventName, eventOptions) {
    // `keyCode` is a deprecated property.
    // @see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // Due to this deprecation `ember-native-dom-helpers` doesn't accept `keyCode` as a `KeyboardEvent` option.
    if (typeof eventOptions.key === 'undefined' && typeof eventOptions.keyCode !== 'undefined') {
      eventOptions.key = eventOptions.keyCode.toString();
      delete eventOptions.keyCode;
    }

    if (KEYBOARD_EVENT_TYPES.indexOf(eventName) > -1) {
      this.invokeHelper(selector, { testContainer }, keyEvent, eventName, eventOptions.key, eventOptions);
    } else {
      this.invokeHelper(selector, { testContainer }, triggerEvent, eventName, eventOptions);
    }
  }

  focus(selector, options) {
    const element = this.findWithAssert(selector, options)[0];

    assertFocusable(element, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    focus(element);
  }

  blur(selector, options) {
    const element = this.findWithAssert(selector, options)[0];

    assertFocusable(element, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    blur(element);
  }
}
