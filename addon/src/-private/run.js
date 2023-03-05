import { resolve } from 'rsvp';
import { getRoot } from './helpers';
import { chainable, isChainedNode } from './chainable';

/**
 * Run action
 *
 * @param {Ceibo} node Page object node to run action on
 * @param {object} query
 * @param {Function} cb Some async activity callback
 * @returns {Ceibo}
 */
export function run(node, cb) {
  const root = getRoot(node);
  if (isChainedNode(node)) {
    // Our root is already the root of the chained tree,
    // we need to wait on its promise if it has one so the
    // previous invocations can resolve before we run ours.
    root._promise = resolve(root._promise).then(() => cb());

    return node;
  } else {
    // Store our invocation result on the chained root
    // so that chained calls can find it to wait on it.
    root._chainedTree._promise = cb();

    return chainable(node);
  }
}
