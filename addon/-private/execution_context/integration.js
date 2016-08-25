import Ember from 'ember';
import {
  guardMultiple,
  buildSelector
} from '../helpers';
import { throwBetterError } from '../better-errors';

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

  fillIn(selector, container, text) {
    let element = this.$(selector, container);

    element.val(text);
    element.trigger('input');
    element.change();
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

    if (options.testContainer) {
      result = $(selector, options.testContainer);
    } else {
      result = this.testContext.$(selector);
    }

    if (result.length === 0) {
      throwBetterError(this.pageObjectNode, options.pageObjectKey, selector);
    }
  },

  find(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    if (options.testContainer) {
      result = $(selector, options.testContainer);
    } else {
      result = this.testContext.$(selector);
    }

    guardMultiple(result, selector, options.multiple);

    return result;
  },

  findWithAssert(selector, options) {
    let result;

    selector = buildSelector(this.pageObjectNode, selector, options);

    if (options.testContainer) {
      result = $(selector, options.testContainer);
    } else {
      result = this.testContext.$(selector);
    }

    guardMultiple(result, selector, options.multiple);

    if (result.length === 0) {
      throwBetterError(this.pageObjectNode, options.pageObjectKey, selector);
    }

    return result;
  }
};
