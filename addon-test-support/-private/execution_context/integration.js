import $ from '-jquery';
import { run } from '@ember/runloop';
import {
  fillElement,
  assertFocusable
} from './helpers';

import ExecutionContext from './execution-context';

export default class IntegrationExecutionContext extends ExecutionContext {
  constructor(pageObjectNode, testContext) {
    super(...arguments);

    this.testContext = testContext;
  }

  get contextElement() {
    return $('#ember-testing');
  }

  run(cb) {
    return cb(this);
  }

  runAsync(cb) {
    run(() => {
      cb(this);
    });

    return this.chainable();
  }

  chainable() {
    return this.pageObjectNode;
  }

  visit() {}

  click(selector, testContainer) {
    $(this.getElements(selector, { testContainer })).click();
  }

  fillIn(selector, testContainer, options, content) {
    let elements = this.getElements(selector, { testContainer }).toArray();

    elements.forEach((el) => {
      fillElement(el, content, {
        selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $(el).trigger('input');
      $(el).change();
    });
  }

  triggerEvent(selector, testContainer, options, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    $(this.getElements(selector, { testContainer })).trigger(event);
  }

  focus(selector, options) {
    let element = this.findWithAssert(selector, options)[0];

    assertFocusable(element, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $(element).focus();
  }

  blur(selector, options) {
    let element = this.findWithAssert(selector, options)[0];

    assertFocusable(element, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $(element).blur();
  }
}
