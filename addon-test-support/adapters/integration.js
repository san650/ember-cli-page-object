import $ from '-jquery';
import {
  fillElement,
  assertFocusable
} from './helpers';
import wait from 'ember-test-helpers/wait';
import Adapter from "../adapter";

export default class IntegrationAdapter extends Adapter {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext && this.testContext._element ?
      this.testContext._element :
      '#ember-testing';
  }

  wait() {
    return wait();
  }

  click(element) {
    $(element).click();

    return this.wait();
  }

  fillIn(element, content) {
    fillElement(element, content);

    $(element).trigger('input');
    $(element).change();

    return this.wait();
  }

  triggerEvent(element, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    $(element).trigger(event);

    return this.wait();
  }

  focus(element) {
    assertFocusable(element);

    $(element).focus();

    return this.wait();
  }

  blur(element) {
    assertFocusable(element);

    $(element).blur();

    return this.wait();
  }
}
