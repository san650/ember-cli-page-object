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
import { chainable } from './utils';

export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  run(helper, onFailure) {
    try {
      return helper()
    } catch(e) {
      onFailure(e);
    }
  },

  runAsync(cb) {
    window.wait().then(() => {
      cb(this);
    });

    return chainable(this.pageObjectNode);
  },

  visit(path) {
    /* global visit */
    visit(path);
  },

  click(selector, container) {
    /* global click */
    click(selector, container);
  },

  fillIn(selector, container, options, content) {
    let $selection = find(selector, container || findClosestValue(this.pageObjectNode, 'testContainer'));

    /* global focus */
    focus($selection);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    /* global triggerEvent */
    triggerEvent(selector, container, 'input');
    triggerEvent(selector, container, 'change');
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

  assertElementExists(selector, options) {
    /* global find */
    let result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

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
