import {
  getRootElement,
  visit,
  click,
  fillIn,
  triggerEvent,
  triggerKeyEvent,
  focus,
  blur
} from '@ember/test-helpers';
import Adapter from "../adapter";

export default class RFC268Adapter extends Adapter {
  get testContainer() {
    return getRootElement();
  }

  visit(path) {
    return visit(path);
  }

  click(element) {
    return click(element);
  }

  fillIn(element, content) {
    return fillIn(element, content);
  }

  triggerEvent(element, eventName, eventOptions) {
    if (typeof eventOptions.key !== 'undefined' || typeof eventOptions.keyCode !== 'undefined') {
      const key = eventOptions.key || eventOptions.keyCode;

      return triggerKeyEvent(element, eventName, key, eventOptions);
    }

    return triggerEvent(element, eventName, eventOptions);
  }

  focus(element) {
    return focus(element);
  }

  blur(element) {
    return blur(element);
  }
}
