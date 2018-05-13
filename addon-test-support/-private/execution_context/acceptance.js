import ExecutionContext from './execution-context';
import {
  findClosestValue
} from '../helpers';
import {
  fillElement,
  assertFocusable
} from './helpers';

export default class AcceptanceExecutionContext extends ExecutionContext {
  run(cb) {
    return cb(this);
  }

  runAsync(cb) {
    window.wait().then(() => {
      cb(this);
    });

    return this.chainable();
  }

  chainable() {
    return this.pageObjectNode;
  }

  visit(path) {
    /* global visit */
    visit(path);
  }

  click(selector, container) {
    /* global click */
    click(selector, container);
  }

  fillIn(selector, container, options, content) {
    let $selection = find(selector, container || findClosestValue(this.pageObjectNode, 'testContainer'));

    /* global focus */
    focus($selection);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    /* global triggerEvent */
    triggerEvent(selector, container, 'input');
    triggerEvent(selector, container, 'change');
  }

  triggerEvent(selector, container, options, eventName, eventOptions) {
    /* global triggerEvent */
    triggerEvent(selector, container, eventName, eventOptions);
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
