import { run } from './run';

export default function action(query, cb) {
  return {
    isDescriptor: true,

    get(key) {
      return function (...args) {
        ({ query, cb } = normalizeArgs(key, query, cb, args));

        return run(this, query, (executionContext) => {
          return cb.bind(executionContext)(...args)
        });
      }
    }
  }
}

function normalizeArgs(key, query, cb, args) {
  let formattedKey = `${key}(${args.length
    ? `"${args.map((a) => String(a)).join('", "')}"`
    : ``})`;

  if (typeof query === 'function') {
    cb = query;
    query = {
      key: formattedKey
    };
  } else {
    query = {
      ...query,
      key: formattedKey
    };
  }

  return { query, cb };
}
