import $ from '-jquery';
import { run } from '@ember/runloop';
import BaseContext from './base';
import {
  fillElement,
  assertFocusable
} from './helpers';

export default class IntegrationExecutionContext extends BaseContext {
  constructor(pageObjectNode, testContext) {
    super(pageObjectNode);

    this.testContext = testContext;
  }

  get contextElement() {
    return this.testContext && this.testContext._element
      || '#ember-testing';
  }

  run(cb) {
    run(() => {
      cb(this);
    });
  }

  click(selector, container, options) {
    this.getElements(selector, options).click();
  }

  fillIn(selector, container, options, content) {
    let $selection = this.getElements(selector, options);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.trigger('input');
    $selection.change();
  }

  triggerEvent(selector, container, options, eventName, eventOptions) {
    let $selection = this.getElements(selector, options);

    let event = $.Event(eventName, eventOptions);

    $selection.trigger(event);
  }

  focus(selector, options) {
    let $selection = this.findWithAssert(selector, options);

    assertFocusable($selection[0], {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.focus();
  }

  blur(selector, options) {
    let $selection = this.findWithAssert(selector, options);

    assertFocusable($selection[0], {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $selection.blur();
  }
}
