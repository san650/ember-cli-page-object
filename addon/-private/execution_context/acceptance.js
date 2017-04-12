import {
  guardMultiple,
  buildSelector,
  findClosestValue
} from '../helpers';
import {
  fillElement
} from '../properties/fillable';
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
    /* global wait */
    wait().then(() => {
      cb(this);
    });

    return this.pageObjectNode;
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
    let $el = find(selector, container || findClosestValue(this.pageObjectNode, 'testContainer'));

    /* global focus */
    focus($el);

    fillElement($el, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    /* global triggerEvent */
    triggerEvent(selector, container, 'input');
    triggerEvent(selector, container, 'change');
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    /* global triggerEvent */
    triggerEvent(selector, container, eventName, eventOptions);
  },

  assertElementExists(selector, options) {
    /* global find */
    let result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    if (result.length === 0) {
      throwBetterError(this.pageObjectNode, options.pageObjectKey, selector, ELEMENT_NOT_FOUND);
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
      throwBetterError(this.pageObjectNode, options.pageObjectKey, selector, ELEMENT_NOT_FOUND);
    }

    guardMultiple(result, selector, options.multiple);

    return result;
  }
};
