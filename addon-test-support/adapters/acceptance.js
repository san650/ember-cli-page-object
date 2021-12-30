/* global Ember */
/* eslint-disable ember/new-module-imports */
const { $ } = Ember;

import { fillElement, assertFocusable } from './helpers';

import Adapter from '../adapter';

export default class AcceptanceAdapter extends Adapter {
  get testContainer() {
    return '#ember-testing';
  }

  wait() {
    return window.wait();
  }

  visit(path) {
    /* global visit */
    visit(path);

    return this.wait();
  }

  click(element) {
    /* global click */
    click(element);

    return this.wait();
  }

  fillIn(element, content) {
    // global focus
    focus(element);

    fillElement(element, content);

    /* global triggerEvent */
    triggerEvent(element, 'input');
    triggerEvent(element, 'change');

    return this.wait();
  }

  triggerEvent(element, eventName, eventOptions) {
    // global triggerEvent
    triggerEvent(element, eventName, eventOptions);

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
