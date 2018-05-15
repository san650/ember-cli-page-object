import $ from '-jquery';

import {
  guardMultiple,
  buildSelector,
  findClosestValue,
} from '../helpers';

import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

export default class ExecutionContext {
  constructor(pageObjectNode) {
    this.pageObjectNode = pageObjectNode;
  }

  /**
   * Root node to search element in
   *
   * @returns Element
   */
  get contextElement() {
    return document.querySelector('#ember-testing');
  }

  getElements(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');
    if (container) {
      return $(selector, container);
    } else {
      return $(selector, this.contextElement);
    }
  }

  find(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    let result = this.getElements(selector, options);

    guardMultiple(result, selector, options.multiple);

    return result;
  }

  assertElementExists(selector, options) {
    let result = this.getElements(selector, options);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }
  }

  findWithAssert(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    let result = this.getElements(selector, options);

    guardMultiple(result, selector, options.multiple);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }

    return result;
  }

  invokeHelper(selector, options, helper, ...args) {
    let element = this.getElements(selector, options)[0];
    return helper(element, ...args).catch((e) => {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        e.message || e.toString(),
        { selector }
      );
    });
  }

  // @todo: remove me after `fillable` is updated to call `fillElement`
  fillIn(selector, testContainer, options, content) {
    let elements = this.getElements(selector, { testContainer }).toArray();

    elements.forEach((el) => {
      this.fillElement(el, content, {
        selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });
    });
  }
}
