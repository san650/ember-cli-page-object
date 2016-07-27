import Ember from 'ember';
import {
  findElementWithAssert,
  simpleFindElementWithAssert
} from '../../helpers';

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
    let event = Ember.$.Event(eventName, eventOptions);

    if (container) {
      $(selector, container).trigger(event);
    } else {
      this.testContext.$(selector).trigger(event);
    }
  },

  assertElementExists(selector, options) {
    simpleFindElementWithAssert(this.pageObjectNode, selector, options);
  },

  findWithAssert(selector, options) {
    return findElementWithAssert(this.pageObjectNode, selector, options);
  }
};
