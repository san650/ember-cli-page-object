import Ceibo from '@ro0gr/ceibo';

export default class Selector {
  constructor(node, locator) {
    this.node = node;

    if (locator) {
      this.locator = normalizeLocator(locator);
    }
  }

  get path() {
    const { locator } = this;

    const wayBackToRoot = [
      locator && {
        scope: [locator.scope, locator.selector].filter(Boolean).join(' '),
        resetScope: locator.resetScope,
      },

      ...mapToRoot(this.node, (n) => {
        return {
          scope: n.scope,
          resetScope: n.resetScope,
        };
      }),
      // @todo: test resetScope with nested `scope`
    ].filter((n) => n && Boolean(n.scope));

    const startIndex = wayBackToRoot.findIndex((node) => node.resetScope);
    const breadcrumbs =
      startIndex > -1 ? wayBackToRoot.slice(0, startIndex + 1) : wayBackToRoot;

    const path = breadcrumbs
      .reverse()
      .map((n) => normalizeLocator(n.scope))
      .reduce((batches, locator) => {
        const [currentBatch] = batches.slice(-1);

        if (
          !currentBatch ||
          typeof currentBatch[0].at === 'number' ||
          typeof locator.at === 'number'
        ) {
          batches.push([locator]);
        } else {
          currentBatch.push(locator);
        }

        return batches;
      }, []);

    return path.length
      ? path
      : [
          [
            {
              selector: ':first-child',
              at: 0,
            },
          ],
        ];
  }

  toString() {
    const { locator } = this;
    const modifiers = [];
    if (locator) {
      if (typeof locator.at === 'number') {
        modifiers.push(`eq(${locator.at})`);
      } else if (locator.last) {
        modifiers.push('last');
      }

      if (locator.visible) {
        modifiers.push(`visible`);
      }

      if (locator.contains) {
        modifiers.push(`contains("${locator.contains}")`);
      }
    }

    const pathSelector = this.path
      .map((subpath) => {
        return subpath
          .map((locator) => {
            if (typeof locator.at === 'number') {
              return `${locator.selector}:eq(${locator.at})`;
            }

            return locator.selector;
          })
          .join(' ');
      })
      .join(' ');

    return modifiers.length
      ? `${pathSelector}:${modifiers.join(':')}`
      : pathSelector;
  }
}

function normalizeLocator(locator) {
  return typeof locator === 'string' ? { selector: locator } : locator;
}

function mapToRoot(node, mapper) {
  let iterator = node;
  let values = [];

  while (typeof iterator !== 'undefined') {
    values.push(mapper(iterator));

    iterator = Ceibo.parent(iterator);
  }

  return values;
}
