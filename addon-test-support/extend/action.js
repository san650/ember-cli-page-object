import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { throwBetterError } from '../-private/better-errors';
import run from '../-private/run';
import { getExecutionContext } from '../-private/execution_context';

export default function action(fn) {
  return {
    isDescriptor: true,

    get(key) {
      return function(...args) {
        return run(this, (context) => {
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
  const context = getExecutionContext(node);

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
