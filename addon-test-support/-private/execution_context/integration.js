import $ from '-jquery';
import { run as emberRunloopRun } from '@ember/runloop';
import run from '../run';
import {
  fillElement,
  assertFocusable
} from './helpers';
import wait from 'ember-test-helpers/wait';

export default function IntegrationExecutionContext(pageObjectNode, testContext) {
  this.pageObjectNode = pageObjectNode;
  this.testContext = testContext;
}

IntegrationExecutionContext.prototype = {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext ?
      this.testContext._element :
      '#ember-testing';
  },

  andThen(cb) {
    emberRunloopRun(() => {
      cb(this)
    });

    return wait();
  },

  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  visit() {},

  click(element) {
    $(element).click();
  },

  fillIn(element, content) {
    fillElement(element, content);

    $(element).trigger('input');
    $(element).change();
  },

  triggerEvent(element, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    $(element).trigger(event);
  },

  focus(element) {
    assertFocusable(element);

    $(element).focus();
  },

  blur(element) {
    assertFocusable(element);

    $(element).blur();
  },
};
