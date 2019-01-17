import { resolve } from 'rsvp';
import { getExecutionContext } from './execution_context';
import { getRoot, isPageObject } from './helpers';
import Ceibo from 'ceibo';

/**
 * Run action and return a chainable node
 *
 * @param {Ceibo} node Page object node to run action on
 * @param {Function} cb Some async activity callback
 * @returns {Ceibo}
 */
export function run(node, cb) {
  const adapter = getExecutionContext(node);

  if (typeof adapter.andThen === 'function') {
    // Historically synchronous invocations with moduleFor* execution contexts
    // behave the same way despite they were called in a chain or one by one,
    // so we don't need to involve a chainedTree.
    adapter.andThen(cb);

    return node;
  } else if (isChainedNode(node)) {
    // Our root is the root of the chained tree, and we
    // need to wait on its promise if it has one so the
    // previous invocations can resolve before we run ours.
    let root = getRoot(node)

    root._promise = resolve(root._promise).then(() => cb(adapter));

    return node;
  } else {
    // Store our invocation result on the chained root
    // so that chained calls can find it to wait on it.
    getRoot(node)._chainedTree._promise = cb(adapter);

    return chainable(node);
  }
}

export function isChainedNode(node) {
  if (!isPageObject(node)) {
    return false;
  }

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
    node = getChildNode(node, key)
  });

  return node;
}

function getChildNode(node, key) {
  // Normally an item's key is just its property name, but collection
  // items' keys also include their index. Collection item keys look like
  // `foo[2]` and legacy collection item keys look like `foo(2)`.
  let match;
  if ((match = /\[(\d+)\]$/.exec(key))) {
    // This is a collection item
    let [ indexStr, index ] = match;
    let name = key.slice(0, -indexStr.length);

    return node[name].objectAt(parseInt(index, 10));
  } else if ((match = /\((\d+)\)$/.exec(key))) {
    // This is a legacy collection item
    let [ indexStr, index ] = match;
    let name = key.slice(0, -indexStr.length);

    return node[name](parseInt(index, 10));
  } else {
    return node[key];
  }
}

