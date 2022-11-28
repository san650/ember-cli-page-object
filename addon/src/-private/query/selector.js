import Ceibo from '@ro0gr/ceibo';
import { getAdapter } from 'ember-cli-page-object/adapters/index';

export default class Selector {
  constructor(node, locator) {
    this.node = node;

    if (locator) {
      this.locator =
        typeof locator === 'string' ? { selector: locator } : locator;
    }
  }

  get container() {
    return (
      (this.locator && this.locator.testContainer) ||
      findClosestValue(this.node, 'testContainer') ||
      getAdapter().testContainer
    );
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
    ].filter((n) => n && Boolean(n.scope));

    const startIndex = wayBackToRoot.findIndex((node) => node.resetScope);
    const breadcrumbs =
      startIndex > -1 ? wayBackToRoot.slice(0, startIndex + 1) : wayBackToRoot;

    const path = breadcrumbs
      .reverse()
      .map((n) => n.scope)
      .map((locator) => {
        if (typeof locator === 'string') {
          return { selector: locator };
        } else {
          return locator;
        }
      })
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

function mapToRoot(node, mapper) {
  let iterator = node;
  let values = [];

  while (typeof iterator !== 'undefined') {
    values.push(mapper(iterator));

    iterator = Ceibo.parent(iterator);
  }

  return values;
}

function findClosestValue(node, property) {
  if (typeof node[property] !== 'undefined') {
    return node[property];
  }

  let parent = Ceibo.parent(node);

  if (typeof parent !== 'undefined') {
    return findClosestValue(parent, property);
  }
}
