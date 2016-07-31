import Ember from 'ember';
import {
  guardMultiple,
  buildSelector,
  findElementWithAssert,
  simpleFindElementWithAssert
} from '../helpers';

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
    simpleFindElementWithAssert(this.pageObjectNode, selector, options);
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
    return findElementWithAssert(this.pageObjectNode, selector, options);
  }
};
