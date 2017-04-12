import Ember from 'ember';
import {
  guardMultiple,
  buildSelector,
  findClosestValue
} from '../helpers';
import {
  setFillableElementContent
} from '../properties/fillable';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

const { $, run } = Ember;

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

    return this.pageObjectNode;
  },

  // Do nothing in integration test
  visit: $.noop,

  click(selector, container) {
    this.$(selector, container).click();
  },

  fillIn(selector, container, options, content) {
    let $el = this.$(selector, container);

    setFillableElementContent($el, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $el.trigger('input');
    $el.change();
  },

  $(selector, container) {
    if (container) {
      return $(selector, container);
    } else {
      return this.testContext.$(selector);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    if (container) {
      $(selector, container).trigger(event);
    } else {
      this.testContext.$(selector).trigger(event);
    }
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
      throwBetterError(this.pageObjectNode, options.pageObjectKey, selector, ELEMENT_NOT_FOUND);
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
      throwBetterError(this.pageObjectNode, options.pageObjectKey, selector, ELEMENT_NOT_FOUND);
    }

    return result;
  }
};
