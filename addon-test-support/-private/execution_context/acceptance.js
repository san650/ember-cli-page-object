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

  click(selector, testContainer) {
    /* global click */
    let elements = this.getElements(selector, { testContainer });
    click(elements);
  }

  fillIn(selector, testContainer, options, content) {
    let $selection = this.getElements(selector, { testContainer });

    /* global focus */
    focus($selection);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    /* global triggerEvent */
    triggerEvent(selector, 'input');
    triggerEvent(selector, 'change');
  }

  triggerEvent(selector, testContainer, options, eventName, eventOptions) {
    const elements = this.getElements(selector, { testContainer })
    /* global triggerEvent */
    triggerEvent(elements, eventName, eventOptions);
  }

  focus(selector, options) {
    let $element = this.findWithAssert(selector, options)[0];

    assertFocusable($element, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $element.focus();
  }

  blur(selector, options) {
    let $element = this.findWithAssert(selector, options)[0];

    assertFocusable($element, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    $element.blur();
  }
}
