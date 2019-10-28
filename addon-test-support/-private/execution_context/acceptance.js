import run from '../run';
import $ from '-jquery';
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

export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  andThen(cb) {
    return window.wait().then(() => {
      cb(this);
    });
  },

  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  visit(path) {
    /* global visit */
    visit(path);
  },

  click(element) {
    /* global click */
    click(element);
  },

  fillIn(element, content) {
    /* global focus */
    focus(element);

    fillElement(element, content);

    /* global triggerEvent */
    triggerEvent(element, 'input');
    triggerEvent(element, 'change');
  },

  triggerEvent(element, eventName, eventOptions) {
    /* global triggerEvent */
    triggerEvent(element, eventName, eventOptions);
  },

  focus(element) {
    assertFocusable(element);

    $(element).focus();
  },

  blur(element) {
    assertFocusable(element);

    $(element).blur();
  },

  find(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    guardMultiple(result, selector, options.multiple);

    return result;
  },

  findWithAssert(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    /* global find */
    result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

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
