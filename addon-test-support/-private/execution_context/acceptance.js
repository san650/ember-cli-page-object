import BaseContext from './base';
import { fillElement, assertFocusable } from './helpers';

export default class AcceptanceExecutionContext extends BaseContext {
  get contextElement() {
    return this.testContext && this.testContext._element
      || '#ember-testing';
  }

  getElements(selector, options) {
    return find(selector, this._getTestContainer(options));
  }

  run(cb) {
    return window.wait().then(() => {
      cb(this);
    });
  }

  visit(path) {
    /* global visit */
    visit(path);
  }

  click(selector, options) {
    const el = this.getElements(selector, options)[0];

    /* global click */
    click(el);
  }

  fillIn(selector, options, content) {
    const $selection = this.getElements(selector, options);

    /* global focus */
    focus($selection);

    fillElement($selection, content, {
      selector,
      pageObjectNode: this.pageObjectNode,
      pageObjectKey: options.pageObjectKey
    });

    /* global triggerEvent */
    triggerEvent(selector, this._getTestContainer(options), 'input');
    triggerEvent(selector, this._getTestContainer(options), 'change');
  }

  triggerEvent(selector, options, eventName, eventOptions) {
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
