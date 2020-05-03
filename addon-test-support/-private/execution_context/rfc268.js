import $ from '-jquery';
import { run } from '../action';
import {
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
    return run(this.pageObjectNode, {}, cb);
  },

  visit(path) {
    return visit(path);
  },

  click(element) {
    return click(element);
  },

  fillIn(element, content) {
    return fillIn(element, content);
  },

  triggerEvent(element, eventName, eventOptions) {
    if (typeof eventOptions.key !== 'undefined' || typeof eventOptions.keyCode !== 'undefined') {
      const key = eventOptions.key || eventOptions.keyCode;

      return triggerKeyEvent(element, eventName, key, eventOptions);
    }

    return triggerEvent(element, eventName, eventOptions);
  },

  focus(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    return this.invokeHelper(selector, options, focus);
  },

  blur(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    return this.invokeHelper(selector, options, blur);
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
