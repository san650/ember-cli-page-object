import { resolve } from 'rsvp';
import $ from '-jquery';
import chainable from '../utils/chainable';
import {
  guardMultiple,
  buildSelector,
  findClosestValue,
  getRoot
} from '../helpers';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

export default class Adapter {
  constructor(pageObjectNode) {
    this.pageObjectNode = pageObjectNode;
  }

  get contextElement() {
    throw new Error('"contextElement" not implemented');
  }

  run(cb) {
    return cb(this);
  }

  runAsync(cb) {
    let root = getRoot(this.pageObjectNode);
    let isChained = !root._chainedTree;

    if (isChained) {
      // Already chained, so our root is the root of the chained tree, and we
      // need to wait on its promise if it has one so the previous call can
      // resolve before we run ours.
      root._promise = resolve(root._promise).then(() => this.run(cb));
    } else {
      // Not a chained call, so store our method's return on the chained root
      // so that chained calls can find it to wait on it.
      root._chainedTree._promise = this.run(cb);
    }

    return chainable(this.pageObjectNode);
  }

  _getTestContainer(options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    return container || this.contextElement;
  }

  getElements(selector, options) {
    return $(selector, this._getTestContainer(options));
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

  invokeHelper(/* selector, options, helper, ...args */) {
    throw new Error('"blur" is not supported')
  }

  visit(/* path */) {
    throw new Error('"visit" is not supported')
  }

  click(/* selector, container, options */) {
    throw new Error('"click" is not supported')
  }

  fillIn(/* selector, container, options, content */) {
    throw new Error('"fillIn" is not supported')
  }

  triggerEvent(/* selector, container, options, eventName, eventOptions */) {
    throw new Error('"triggerEvent" is not supported')
  }

  focus(/* selector, options */) {
    throw new Error('"focus" is not supported')
  }

  blur(/* selector, options */) {
    throw new Error('"blur" is not supported')
  }
}
