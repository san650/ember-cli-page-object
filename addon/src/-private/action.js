import { getter } from '../macros/index';
import { run } from './run';
import { throwContextualError } from './better-errors';

export default function action(options, act) {
  [act, options] = normalizeArgs(options, act);

  if (typeof act !== 'function') {
    throw new Error('`action()` expects a function argument.');
  }

  return getter(function (key) {
    return function (...args) {
      options.pageObjectKey = formatKey(key, args);

      return run(this, () => {
        try {
          const invocation = act.bind(this)(...args);

          return Promise.resolve(invocation).catch((e) => {
            throwContextualError(this, options, e);
          });
        } catch (e) {
          throwContextualError(this, options, e);
        }
      });
    };
  });
}

function normalizeArgs(options, act) {
  if (!act) {
    return [options, {}];
  }

  return [act, { ...options }];
}

function formatKey(key, args) {
  return `${key}(${
    args.length ? `"${args.map((a) => String(a)).join('", "')}"` : ``
  })`;
}
