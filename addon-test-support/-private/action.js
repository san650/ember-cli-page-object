import { resolve } from 'rsvp';
import { getExecutionContext } from './execution_context';
import { getRoot, assign, buildSelector } from './helpers';
import Ceibo from 'ceibo';
import { throwBetterError } from './better-errors';

export default function action(query, cb) {
  return {
    isDescriptor: true,

    get(key) {
      return function (...args) {
        let formattedKey = `${key}(${
          args.length
            ? `"${args.map((a) => String(a)).join('", "')}"`
            : ``
          })`;

        if (typeof query === 'function') {
          cb = query;
          query = {
            key: formattedKey
          };
        } else {
          query = assign({}, query, {
            key: formattedKey
          });
        }

        return run(this, query, (context) => {
          const selector = buildSelector(this, query.selector, query);

          let res;
          try {
            res = cb.bind(context)(...args);
          } catch(e) {
            throwBetterError(this, query.key, e, { selector });
          }

          return resolve(res).catch((e) => {
            throwBetterError(this, query.key, e, { selector });
          });
        })
      }
    }
  }
}

/**
 * Run action
 *
 * @param {Ceibo} node Page object node to run action on
 * @param {object} query
 * @param {Function} cb Some async activity callback
 * @returns {Ceibo}
 */
export function run(node, query, cb) {
  const adapter = getExecutionContext(node);
  adapter.query = query;
  adapter.node = adapter.pageObjectNode;

  const chainedRoot = getRoot(node)._chainedTree;

  if (typeof adapter.andThen === 'function') {
    // With old ember-testing helpers, we don't make the difference between
    // chanined VS independent action invocations. Awaiting for the previous
    // action settlement, before invoke a new action, is a part of
    // the legacy testing helpers adapters for backward compat reasons
    chainedRoot._promise = adapter.andThen(cb);

    return node;
  } else if (!chainedRoot) {
    // Our root is already the root of the chained tree,
    // we need to wait on its promise if it has one so the
    // previous invocations can resolve before we run ours.
    let root = getRoot(node)
    root._promise = resolve(root._promise).then(() => cb(adapter));

    return node;
  } else {
    // Store our invocation result on the chained root
    // so that chained calls can find it to wait on it.
    chainedRoot._promise = cb(adapter);

    return chainable(node);
  }
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
