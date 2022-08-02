import { getter } from '../macros/index';
import { run } from './run';
import { throwContextualError } from './better-errors';

export default function action(options, cb) {
  return getter(function (key) {
    return function (...args) {
      ({ options, cb } = normalizeArgs(key, options, cb, args));

      return run(this, () => {
        try {
          const invocation = cb.bind(this)(...args);

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

function normalizeArgs(key, options, cb, args) {
  const formattedKey = `${key}(${
    args.length ? `"${args.map((a) => String(a)).join('", "')}"` : ``
  })`;

  if (typeof options === 'function') {
    cb = options;
    options = {
      pageObjectKey: formattedKey,
    };
  } else {
    options = {
      ...options,
      pageObjectKey: formattedKey,
    };
  }

  return { options, cb };
}
