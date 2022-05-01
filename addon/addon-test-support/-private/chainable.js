import Ceibo from '@ro0gr/ceibo';
import { getRoot } from './helpers';

export function isChainedNode(node) {
  let root = getRoot(node);

  return !root._chainedTree;
}

export function chainable(branch) {
  if (isChainedNode(branch)) {
    return branch;
  }

  // See explanation in `create.js` -- here instead of returning the node on
  // which our method was invoked, we find and return our node's mirror in the
  // chained tree so calls to it can be recognized as chained calls, and
  // trigger the chained-call waiting behavior.
  // Collecting node keys to build a path to our node, and then use that
  // to walk back down the chained tree to our mirror node.
  let path = [];
  let node;
  for (node = branch; node; node = Ceibo.parent(node)) {
    path.unshift(Ceibo.meta(node).key);
  }

  // The path will end with the root's key, 'root', so shift that back off
  path.shift();
  node = getRoot(branch)._chainedTree;
  path.forEach((key) => {
    node = getChildNode(node, key);
  });

  return node;
}

function getChildNode(node, key) {
  // Normally an item's key is just its property name, but collection
  // items' keys also include their index, like `foo[2]`.
  let match;
  if ((match = /\[(\d+)\]$/.exec(key))) {
    // This is a collection item
    let [indexStr, index] = match;
    let name = key.slice(0, -indexStr.length);

    return node[name].objectAt(parseInt(index, 10));
  } else {
    return node[key];
  }
}
