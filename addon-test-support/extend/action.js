import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { throwBetterError } from '../-private/better-errors';
import run from '../-private/run';
import { getRoot } from '../-private/helpers';

const NOT_A_FUNCTION_ERROR = 'Argument passed to `action` must be a function.';

export default function action(fn) {
  return {
    isDescriptor: true,

    get(key) {
      if (typeof fn !== 'function') {
        throwBetterError(this, key, NOT_A_FUNCTION_ERROR);
      }

      return function(...args) {
        return run(this, function(context) {
          // @todo: better handling of possible arg types
          const formattedArgs = args.length ? `"${args.join('", "')}"` : '';

          context.key = `${key}(${formattedArgs})`;

          return fn.bind(this)(...args);
        });
      }
    }
  }
}

export function invokeHelper(node, selector, query, cb) {
  const context = getRoot(node).__execution_context__;

  const _query = Object.assign({ multiple: true }, query);

  try {
    const domElements = findElementWithAssert(node, selector, _query).get();

    return Promise.all(domElements.map((element) => {
      return cb(context, element);
    })).then(undefined, (e) => {
      throwBetterError(node, context.key, e, { selector })
    });
  } catch (e) {
    throwBetterError(node, context.key, e, { selector })
  }
}
