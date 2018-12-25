import $ from '-jquery';
import Ceibo from 'ceibo';
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

  runAsync(/* cb */) {
    throw new Error('"runAsync" is not supported');
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
