import $ from '-jquery';
import { run } from '@ember/runloop';
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

export default function IntegrationExecutionContext(pageObjectNode, testContext) {
  this.pageObjectNode = pageObjectNode;
  this.testContext = testContext;
}

IntegrationExecutionContext.prototype = {
  run(cb) {
    return cb(this);
  },

  runAsync(cb) {
    run(() => {
      cb(this);
    });

    return this.chainable();
  },

  chainable() {
    return this.pageObjectNode;
  },

  visit() {},

  click(selector, container) {
    this.$(selector, container).click();
  },

  fillIn(selector, container, options, content) {
    let $selection = this.$(selector, container);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.trigger('input');
    $selection.change();
  },

  $(selector, container) {
    if (container) {
      return $(selector, container);
    } else {
      return this.testContext.$(selector);
    }
  },

  triggerEvent(selector, container, options, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    if (container) {
      $(selector, container).trigger(event);
    } else {
      this.testContext.$(selector).trigger(event);
    }
  },

  focus(selector, options) {
    let $selection = this.findWithAssert(selector, options);

    assertFocusable($selection[0], {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.focus();
  },

  blur(selector, options) {
    let $selection = this.findWithAssert(selector, options);

    assertFocusable($selection[0], {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.blur();
  },

  assertElementExists(selector, options) {
    let result;
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    if (container) {
      result = $(selector, container);
    } else {
      result = this.testContext.$(selector);
    }

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
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    if (container) {
      result = $(selector, container);
    } else {
      result = this.testContext.$(selector);
    }

    guardMultiple(result, selector, options.multiple);

    return result;
  },

  findWithAssert(selector, options) {
    let result;
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    if (container) {
      result = $(selector, container);
    } else {
      result = this.testContext.$(selector);
    }

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
  }
};
