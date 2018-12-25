import { run } from '@ember/runloop';
import {
  visit,
  click,
  triggerEvent,
  keyEvent,
  focus,
  blur
} from 'ember-native-dom-helpers';

import BaseContext from './base';
import { wait } from '../compatibility';
import {
  fillElement,
  assertFocusable
} from './helpers';

const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

export default class NativeDOMExecutionContext extends BaseContext {
  constructor(pageObjectNode, testContext) {
    super(pageObjectNode);

    this.testContext = testContext;
  }

  get contextElement() {
    return this.testContext && this.testContext._element
      || '#ember-testing';
  }

  chainable() {
    return this.pageObjectNode;
  }

  runAsync(cb) {
    if (this.testContext) {
      run(() => {
        cb(this);
      });
    } else {
      (window.wait || wait)().then(() => {
        cb(this);
      });
    }

    return this.chainable()
  }

  visit() {
    if (this.testContext) {
      throw new Error('"visit" is not supported in integration mode');
    }

    visit(...arguments);
  }

  click(selector, container, options) {
    const el = this.getElements(selector, options)[0];
    click(el);
  }

  fillIn(selector, container, options, content) {
    let elements = this.getElements(selector, options).toArray();

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

  triggerEvent(selector, container, options, eventName, eventOptions) {
    const element = this.getElements(selector, options)[0];

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
