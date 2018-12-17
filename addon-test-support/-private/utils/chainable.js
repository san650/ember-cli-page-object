import Ceibo from 'ceibo';
import { getRoot } from '../helpers';

export default function chainable(pageObject) {
  // See explanation in `create.js` -- here instead of returning the node on
  // which our method was invoked, we find and return our node's mirror in the
  // chained tree so calls to it can be recognized as chained calls, and
  // trigger the chained-call waiting behavior.
  // trigger the chained-call waiting behavior.
  let root = getRoot(pageObject);
  let isChained = !root._chainedTree;

  if (isChained) {
    // Already chained, so our node is in the chained tree
    return pageObject;
  } else {
    // Not already chained, so we need to look up our equivalent node in the
    // chained tree and return that. We do it by walking up the tree
    // collecting node keys to build a path to our node, and then use that
    // to walk back down the chained tree to our mirror node.
    let path = [];
    let node;

    for (node = pageObject; node; node = Ceibo.parent(node)) {
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
