import { resolve } from 'rsvp';
import { getExecutionContext } from './execution_context';
import { getRoot } from './helpers';
import Ceibo from 'ceibo';

/**
 * Run action
 *
 * @param {Ceibo} node Page object node to run action on
 * @param {Function} cb Some async activity callback
 * @returns {Ceibo}
 */
export default function run(node, cb) {
  const chainedRoot = getRoot(node)._chainedTree;

  let executionContext;
  if (!chainedRoot) {
    executionContext = getRoot(node).__execution_context__;
  } else {
    executionContext = chainedRoot.__execution_context__ = getExecutionContext(node);
  }

  if (typeof executionContext.andThen === 'function') {
    // With old ember-testing helpers, we don't make the difference between
    // chanined VS independent action invocations. Awaiting for the previous
    // action settlement, before invoke a new action, is a part of
    // the legacy testing helpers adapters for backward compat reasons
    executionContext._promise = executionContext.andThen(cb);
  } else if (!chainedRoot) {
    // Our root is already the root of the chained tree,
    // we need to wait on its promise if it has one so the
    // previous invocations can resolve before we run ours.
    executionContext._promise = resolve(executionContext._promise).then(() => cb(executionContext));
  } else {
    // Store our invocation result on the chained root
    // so that chained calls can find it to wait on it.
    executionContext._promise = cb(executionContext);
  }

  return chainable(node);
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

function isChainedNode(node) {
  let root = getRoot(node);

  return !root._chainedTree;
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
