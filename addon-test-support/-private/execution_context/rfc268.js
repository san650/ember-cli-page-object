import $ from '-jquery';
import { run } from '../action';
import {
  guardMultiple,
  buildSelector,
  findClosestValue,
} from '../helpers';
import {
  getRootElement,
  visit,
  click,
  fillIn,
  triggerEvent,
  triggerKeyEvent,
  focus,
  blur
} from '../compatibility';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

export default function ExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

ExecutionContext.prototype = {
  get testContainer() {
    return getRootElement();
  },

  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  visit(path) {
    return visit(path);
  },

  click(element) {
    return click(element);
  },

  fillIn(selector, container, options, content) {
    return this.invokeHelper(selector, options, fillIn, content);
  },

  triggerEvent(element, eventName, eventOptions) {
    if (typeof eventOptions.key !== 'undefined' || typeof eventOptions.keyCode !== 'undefined') {
      const key = eventOptions.key || eventOptions.keyCode;

      return triggerKeyEvent(element, eventName, key, eventOptions);
    }

    return triggerEvent(element, eventName, eventOptions);
  },

  focus(element) {
    return focus(element);
  },

  blur(element) {
    return blur(element);
  },

  assertElementExists(selector, options) {
    let result = this.getElements(selector, options);

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
    selector = buildSelector(this.pageObjectNode, selector, options);
    let result = this.getElements(selector, options);

    guardMultiple(result, selector, options.multiple);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }

    return result;
  },

  getElements(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    return $(selector, container || this.testContainer);
  },

  invokeHelper(selector, options, helper, ...args) {
    let element = this.getElements(selector, options)[0];
    return helper(element, ...args).catch((e) => {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        e.message || e.toString(),
        { selector }
      );
    });
  }
};
