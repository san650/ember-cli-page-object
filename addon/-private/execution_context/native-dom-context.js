import $ from '-jquery';

import {
  click,
  triggerEvent,
  keyEvent
} from 'ember-native-dom-helpers';

import {
  guardMultiple,
  buildSelector,
  findClosestValue
} from '../helpers';
import {
  fillElement
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
  run(cb) {
    return cb(this);
  },

  runAsync() {
    throw new Error('not implemented');
  },

  click(selector, container) {
    const el = this.$(selector, container)[0];
    click(el);
  },

  fillIn(selector, container, options, content) {
    let el = this.$(selector, container)[0];

    fillElement(el, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    triggerEvent(el, 'input');
    triggerEvent(el, 'change');
  },

  $(selector, container) {
    if (container) {
      return $(selector, container);
    } else {
      // @todo: we should fixed usage of private `_element`
      // after https://github.com/emberjs/ember-test-helpers/issues/184 is resolved
      let testsContainer = this.testContext ?
        this.testContext._element :
        '#ember-testing';

      return $(selector, testsContainer);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    const element = this.$(selector, container)[0];

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

  find(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    let result = this.$(selector, container);

    guardMultiple(result, selector, options.multiple);

    return result;
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

