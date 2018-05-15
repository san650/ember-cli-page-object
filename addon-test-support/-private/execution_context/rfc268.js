import { resolve } from 'rsvp';
import Ceibo from 'ceibo';
import {
  buildSelector,
  getRoot
} from '../helpers';
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

import ExecutionContext from './execution-context'

export default class RFC268ExecutionContext extends ExecutionContext {
  get contextElement() {
    return getContext().element;
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
      root._promise = resolve(root._promise).then(() => cb(this));
    } else {
      // Not a chained call, so store our method's return on the chained root
      // so that chained calls can find it to wait on it.
      root._chainedTree._promise = cb(this);
    }

    return this.chainable();
  }

  chainable() {
    // See explanation in `create.js` -- here instead of returning the node on
    // which our method was invoked, we find and return our node's mirror in the
    // chained tree so calls to it can be recognized as chained calls, and
    // trigger the chained-call waiting behavior.
    let root = getRoot(this.pageObjectNode);
    let isChained = !root._chainedTree;

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

      node = root._chainedTree;
      path.forEach((key) => {
        // Normally an item's key is just its property name, but collection
        // items' keys also include their index. Collection item keys look like
        // `foo[2]` and legacy collection item keys look like `foo(2)`.
        let match;
        if ((match = /\[(\d+)\]$/.exec(key))) {
          // This is a collection item
          let [ indexStr, index ] = match;
          let name = key.slice(0, -indexStr.length);
          node = node[name].objectAt(parseInt(index, 10));
        } else if ((match = /\((\d+)\)$/.exec(key))) {
          // This is a legacy collection item
          let [ indexStr, index ] = match;
          let name = key.slice(0, -indexStr.length);
          node = node[name](parseInt(index, 10));
        } else {
          node = node[key];
        }
      });
      return node;
    }
  }

  visit(path) {
    return visit(path);
  }

  click(selector, container, options) {
    return this.invokeHelper(selector, options, click);
  }

  fillElement(el, content) {
    return fillIn(el, content);
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
