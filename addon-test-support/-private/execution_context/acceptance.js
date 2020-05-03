import $ from '-jquery';
import { run } from '../action';
import {
  fillElement,
  assertFocusable
} from './helpers';

export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  get testContainer() {
    return  '#ember-testing';
  },

  andThen(cb) {
    return window.wait().then(() => {
      cb(this);
    });
  },

  runAsync(cb) {
    return run(this.pageObjectNode, {}, cb);
  },

  visit(path) {
    /* global visit */
    visit(path);
  },

  click(element) {
    /* global click */
    click(element);
  },

  fillIn(element, content) {
    /* global focus */
    focus(element);

    fillElement(element, content);

    /* global triggerEvent */
    triggerEvent(element, 'input');
    triggerEvent(element, 'change');
  },

  triggerEvent(element, eventName, eventOptions) {
    /* global triggerEvent */
    triggerEvent(element, eventName, eventOptions);
  },

  focus(element) {
    assertFocusable(element);

    $(element).focus();
  },

  blur(element) {
    assertFocusable(element);

    $(element).blur();
  }
};
