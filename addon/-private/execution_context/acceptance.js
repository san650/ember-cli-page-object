import $ from 'jquery';

import {
  click,
  focus,
  triggerEvent,
  visit
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

export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  run(cb) {
    return cb(this);
  },

  runAsync(cb) {
    window.wait().then(() => {
      cb(this);
    });

    return this.pageObjectNode;
  },

  visit(path) {
    visit(path);
  },

  click(selector, container) {
    click(this.$(selector, container)[0]);
  },

  fillIn(selector, container, options, content) {
    const [$selection] = this.$(selector, container || findClosestValue(this.pageObjectNode, 'testContainer'));

    focus($selection);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    triggerEvent($selection, 'input');
    triggerEvent($selection, 'change');
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    const element = this.$(selector, container);

    triggerEvent(element, eventName, eventOptions);
  },

  assertElementExists(selector, options) {
    let result = this.$(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

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
    selector = buildSelector(this.pageObjectNode, selector, options);

    let result = this.$(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));
    guardMultiple(result, selector, options.multiple);

    return result;
  },

  $(selector, container) {
    if (container) {
      return $(selector, container);
    } else {
      let testsContainer = this.testContext ?
        this.testContext._element :
        '#ember-testing';

      return $(selector, testsContainer);
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
