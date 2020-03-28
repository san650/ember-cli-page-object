import $ from '-jquery';

import {
  click,
  triggerEvent,
  keyEvent,
  focus,
  blur
} from 'ember-native-dom-helpers';

import { run } from '../action';
import {
  guardMultiple,
  buildSelector,
  findClosestValue
} from '../helpers';
import {
  fillElement,
  assertFocusable
} from './helpers';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

export default function ExecutionContext(pageObjectNode, testContext) {
  this.pageObjectNode = pageObjectNode;
  this.testContext = testContext;
}

ExecutionContext.prototype = {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext ?
      this.testContext._element :
      '#ember-testing';
  },

  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  click(element) {
    click(element);
  },

  fillIn(selector, container, options, content) {
    let elements = this.$(selector, container).toArray();

    elements.forEach((el) => {
      fillElement(el, content, {
        selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      triggerEvent(el, 'input');
      triggerEvent(el, 'change');
    });
  },

  $(selector, container) {
    return $(selector, container || this.testContainer);
  },

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
  },

  focus(element) {
    assertFocusable(element);

    focus(element);
  },

  blur(element) {
    assertFocusable(element);

    blur(element);
  },

  assertElementExists(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    let result = this.$(selector, container);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }
  },

  findWithAssert(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    let result = this.$(selector, container);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }

    guardMultiple(result, selector, options.multiple);

    return result;
  }
};

