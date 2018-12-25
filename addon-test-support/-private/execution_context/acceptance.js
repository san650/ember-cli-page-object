import BaseContext from './base';
import { findClosestValue } from '../helpers';
import { fillElement, assertFocusable } from './helpers';

export default class AcceptanceExecutionContext extends BaseContext {
  get contextElement() {
    return this.testContext && this.testContext._element
      || '#ember-testing';
  }

  getElements(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    return find(selector, container);
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

  click(selector, container, options) {
    const el = this.getElements(selector, options)[0];

    /* global click */
    click(el);
  }

  fillIn(selector, container, options, content) {
    const el = this.getElements(selector, options)[0];

    /* global focus */
    focus(el);

    fillElement(el, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    /* global triggerEvent */
    triggerEvent(selector, container, 'input');
    triggerEvent(selector, container, 'change');
  }

  triggerEvent(selector, container, options, eventName, eventOptions) {
    const el = this.getElements(selector, options)[0];

    /* global triggerEvent */
    triggerEvent(el, eventName, eventOptions);
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
