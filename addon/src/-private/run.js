import { getAdapter } from '../adapters/index';
import { getRoot } from './helpers';
import { throwContextualError } from './better-errors';
import { chainable, isChainedNode } from './chainable';

/**
 * Run action
 *
 * @param {Ceibo} node Page object node to run action on
 * @param {object} query
 * @param {Function} cb Some async activity callback
 * @returns {Ceibo}
 */
export function run(node, query, cb) {
  const adapter = getAdapter();

  const executionContext = Object.freeze({
    query,
    node,
    adapter,
  });

  const root = getRoot(node);
  if (isChainedNode(node)) {
    // Our root is already the root of the chained tree,
    // we need to wait on its promise if it has one so the
    // previous invocations can resolve before we run ours.
    root._promise = Promise.resolve(root._promise).then(() =>
      invokeHelper(executionContext, cb)
    );

    return node;
  } else {
    // Store our invocation result on the chained root
    // so that chained calls can find it to wait on it.
    root._chainedTree._promise = invokeHelper(executionContext, cb);

    return chainable(node);
  }
}

function invokeHelper(context, cb) {
  let res;

  try {
    res = cb(context);
  } catch (e) {
    throwContextualError(context, e);
  }

  return Promise.resolve(res).catch((e) => {
    throwContextualError(context, e);
  });
}
