// Executes the given callback ensuring Symbol.iterator has a value,
// faking it in pre-ES6 environments.
export default function withIteratorSymbolDefined(callback: () => unknown) {
  if ('Symbol' in window) {
    return callback();
  }

  // @ts-expect-error
  window.Symbol = { iterator: '@@iterator' };
  try {
    return callback();
  } finally {
    delete (window as any).Symbol;
  }
}
