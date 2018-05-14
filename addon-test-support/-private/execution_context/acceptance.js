import ExecutionContext from './execution-context';
import {
  fillElement,
  assertFocusable
} from './helpers';

export default class AcceptanceExecutionContext extends ExecutionContext {
  // constructor(pageObjectNode, testContext) {
  //   super(...arguments);

  //   this.testContext = testContext;
  // }

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
    let elements = this.getElements(selector, { testContainer }).toArray();

    elements.forEach((el) => {
      /* global focus */
      focus(el);

      fillElement(el, content, {
        selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      /* global triggerEvent */
      triggerEvent(el, 'input');
      triggerEvent(el, 'change');
    })
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
