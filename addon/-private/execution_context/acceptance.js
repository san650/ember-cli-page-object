import {
  findElementWithAssert
} from '../../helpers';

export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  run(cb) {
    return cb(this);
  },

  runAsync(cb) {
    /* global wait */
    wait().then(() => {
      cb(this);
    });

    return this.pageObjectNode;
  },

  click(selector, container) {
    /* global click */
    click(selector, container);
  },

  fillIn(selector, container, text) {
    /* global fillIn */
    if (container) {
      fillIn(selector, container, text);
    } else {
      fillIn(selector, text);
    }
  },

  triggerEvent(selector, container, eventName, eventOptions) {
    /* global triggerEvent */
    triggerEvent(selector, container, eventName, eventOptions);
  },

  findWithAssert(selector, options) {
    return findElementWithAssert(this.pageObjectNode, selector, options);
  }
};
