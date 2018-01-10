import $ from '-jquery';
import { resolve } from 'rsvp';
import {
  guardMultiple,
  buildSelector,
  findClosestValue,
  getRoot
} from '../helpers';
import {
  getContext,
  visit,
  click,
  fillIn,
  triggerEvent,
  focus,
  blur
} from '../compatibility';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';
import Ceibo from 'ceibo';

export default function ExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

ExecutionContext.prototype = {
  run(cb) {
    return cb(this);
  },

  runAsync(cb) {
    let isChained = Boolean(this.pageObjectNode._chained);
    let root = getRoot(this.pageObjectNode);

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
  },

  chainable() {
    // See explanation in `create.js` -- here instead of returning the node on
    // which our method was invoked, we find and return our node's mirror in the
    // chained tree so calls to it can be recognized as chained calls, and
    // trigger the chained-call waiting behavior.
    let isChained = Boolean(this.pageObjectNode._chained);

    if (isChained) {
      // Already chained, so our node is in the chained tree
      return this.pageObjectNode;
    } else {
      // Not already chained, so we need to look up our equivalent node in the
      // chained tree and return that. We do it by walking up the tree
      // collecting node keys to build a path to our node, and then use that
      // to walk back down the chained tree to our mirror node.
      let path = [];
      let node;

      for (node = this.pageObjectNode; node; node = Ceibo.parent(node)) {
        path.unshift(Ceibo.meta(node).key);
      }
      // The path will end with the root's key, 'root', so shift that back off
      path.shift();

      node = getRoot(this.pageObjectNode)._chainedTree;
      path.forEach((key) => node = node[key]);
      return node;
    }
  },

  visit(path) {
    return visit(path);
  },

  click(selector, container, options) {
    return this.invokeHelper(selector, options, click);
  },

  fillIn(selector, container, options, content) {
    return this.invokeHelper(selector, options, fillIn, content);
  },

  triggerEvent(selector, container, options, eventName, eventOptions) {
    // `keyCode` is a deprecated property.
    // @see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // Due to this deprecation `ember-native-dom-helpers` doesn't accept `keyCode` as a `KeyboardEvent` option.
    if (typeof eventOptions.key === 'undefined' && typeof eventOptions.keyCode !== 'undefined') {
      eventOptions.key = eventOptions.keyCode.toString();
      delete eventOptions.keyCode;
    }

    return this.invokeHelper(selector, options, triggerEvent, eventName, eventOptions);
  },

  focus(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    return this.invokeHelper(selector, options, focus);
  },

  blur(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    return this.invokeHelper(selector, options, blur);
  },

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
  },

  find(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    let result = this.getElements(selector, options);

    guardMultiple(result, selector, options.multiple);

    return result;
  },

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
  },

  getElements(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');
    if (container) {
      return $(selector, container);
    } else {
      return $(selector, getContext().element);
    }
  },

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
};
