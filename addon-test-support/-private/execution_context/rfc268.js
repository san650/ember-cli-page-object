import { resolve } from 'rsvp';
import BaseContext from './base';
import {
  getContext,
  visit,
  click,
  fillIn,
  triggerEvent,
  triggerKeyEvent,
  focus,
  blur
} from '../compatibility';
import { buildSelector, getRoot } from '../helpers';
import { throwBetterError } from '../better-errors';

export default class RFC268ExecutionContext extends BaseContext {
  get contextElement() {
    return getContext().element;
  }

  runAsync(cb) {
    let root = getRoot(this.pageObjectNode);
    let isChained = !root._chainedTree;

    if (isChained) {
      // Already chained, so our root is the root of the chained tree, and we
      // need to wait on its promise if it has one so the previous call can
      // resolve before we run ours.
      root._promise = resolve(root._promise).then(() => cb(this));
    } else {
      // Not a chained call, so store our method's return on the chained root
      // so that chained calls can find it to wait on it.
      root._chainedTree._promise = cb(this);
    }

    return this.chainable();
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

  visit(path) {
    return visit(path);
  }

  click(selector, container, options) {
    return this.invokeHelper(selector, options, click);
  }

  fillIn(selector, container, options, content) {
    return this.invokeHelper(selector, options, fillIn, content);
  }

  triggerEvent(selector, container, options, eventName, eventOptions) {
    if (typeof eventOptions.key !== 'undefined' || typeof eventOptions.keyCode !== 'undefined') {
      const key = eventOptions.key || eventOptions.keyCode;

      return this.invokeHelper(selector, options, triggerKeyEvent, eventName, key, eventOptions);
    }

    return this.invokeHelper(selector, options, triggerEvent, eventName, eventOptions);
  }

  focus(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    return this.invokeHelper(selector, options, focus);
  }

  blur(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    return this.invokeHelper(selector, options, blur);
  }
}
