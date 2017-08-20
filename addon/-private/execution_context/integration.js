import Ember from 'ember';
import $ from 'jquery';

import {
  click,
  triggerEvent
} from 'ember-native-dom-helpers';

import {
  guardMultiple,
  buildSelector,
  findClosestValue
} from '../helpers';
import {
  fillElement
} from './helpers';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

const { run } = Ember;

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
    this.$(selector, container).each((pos, el) => {
      click(el);
    });
  },

  fillIn(selector, container, options, content) {
    let $selection = this.$(selector, container);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.each((pos, el) => {
      triggerEvent(el, 'input');
      triggerEvent(el, 'change');
    });
  },

  $(selector, container) {
    if (container) {
      return $(selector, container);
    } else {
      let testsContainer = this.testContext ?
        this.testContext._element :
        '#ember-testing';

      return $(selector, testsContainer);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    this.$(selector, container).trigger(event);
  },

  assertElementExists(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    let result = this.$(selector, container);

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
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    let result = this.$(selector, container);

    guardMultiple(result, selector, options.multiple);

    return result;
  },

  findWithAssert(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    let result = this.$(selector, container);

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
