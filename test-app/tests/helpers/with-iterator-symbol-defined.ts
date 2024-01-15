// Executes the given callback ensuring Symbol.iterator has a value,
// faking it in pre-ES6 environments.
export default function withIteratorSymbolDefined(callback: () => unknown) {
  if ('Symbol' in window) {
    return callback();
  }

  // @ts-expect-error support old browsers
  window.Symbol = { iterator: '@@iterator' };
  try {
    return callback();
  } finally {
    // @ts-expect-error support old browsers
    delete window.Symbol;
  }
}
