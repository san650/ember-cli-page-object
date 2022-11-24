import Ceibo from '@ro0gr/ceibo';
import { getAdapter } from '../adapters/index';
import { $ } from './helpers';
import { isVisible, containsText } from './element';
import deprecate from './deprecate';

/**
 * @public
 *
 * Builds a CSS selector from a target selector and a PageObject or a node in a PageObject, along with optional parameters.
 *
 * @example
 *
 * const component = PageObject.create({ scope: '.component'});
 *
 * buildSelector(component, '.my-element');
 * // returns '.component .my-element'
 *
 * @example
 *
 * const page = PageObject.create({});
 *
 * buildSelector(page, '.my-element', { at: 0 });
 * // returns '.my-element:eq(0)'
 *
 * @example
 *
 * const page = PageObject.create({});
 *
 * buildSelector(page, '.my-element', { contains: "Example" });
 * // returns ".my-element :contains('Example')"
 *
 * @example
 *
 * const page = PageObject.create({});
 *
 * buildSelector(page, '.my-element', { last: true });
 * // returns '.my-element:last'
 *
 * @param {Ceibo} node - Node of the tree
 * @param {string} targetSelector - CSS selector
 * @param {Object} options - Additional options
 * @param {boolean} options.resetScope - Do not use inherited scope
 * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} options.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} options.last - Filter by using :last pseudo-class
 * @param {boolean} options.visible - Filter by using :visible pseudo-class
 * @return {string} Fully qualified selector
 *
 * @todo: update doc
 */
export class Query {
  constructor(node, locator) {
    this.node = node;

    this.selector = new Selector(node, locator);
  }

  all() {
    const elements = search(this.selector);

    // filters
    const { visible, contains } = this.selector.locator;
    let filteredElements = elements.filter((element) => {
      if (visible && !isVisible(element)) {
        return false;
      }

      if (contains && !containsText(element, contains)) {
        return false;
      }

      return true;
    });

    // pick by index if specified
    const { at, last } = this.selector.locator;
    return (
      last
        ? [filteredElements.pop()]
        : typeof at === 'number'
        ? [filteredElements[at]]
        : filteredElements
    ).filter(Boolean);
  }

  // @todo: tests for filters via findOne
  toString() {
    return this.selector.toString();
  }
}

class Selector {
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

function getQueryEngine() {
  return JQueryQueryEngine;
}

class JQueryQueryEngine {
  static all(path, containerElement) {
    const selector = path.join(' ');

    validate(selector);
    return $(selector, containerElement).toArray();
  }

  static serialize(path) {
    return path.join(' ');
  }
}

function validate(selector) {
  if (selector.indexOf(',') > -1) {
    deprecate(
      'comma-separated-selectors',
      'Usage of comma separated selectors is deprecated in ember-cli-page-object',
      '1.16.0',
      '2.0.0'
    );
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

function search(selector) {
  const { path, container } = selector;

  return path
    .reduce(
      (queryRootElements, subpath) => {
        return (
          queryRootElements
            .map((root) => {
              const selectors = subpath.map((locator) => locator.selector);

              const elements = getQueryEngine().all(selectors, root);

              const { at } = subpath[0];

              return typeof at === 'number' ? elements[at] : elements;
            })
            // IE compatibility for `Array.prototype.flat()`
            .reduce((flattened, batchResults) => {
              return flattened.concat(batchResults);
            }, [])
        );
      },
      [container]
    )
    .filter(Boolean);
}
