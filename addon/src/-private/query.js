import Ceibo from '@ro0gr/ceibo';
import { getAdapter } from 'ember-cli-page-object/adapters';
import Locator from './query/locator';
import { QuerySelector } from './query/selector';

/**
 * @private
 *
 * DOM Elements Query
 *
 * @example
 *
 * const query = new Query(pageObjectNode, '.child-element');
 * query.all();
 *
 * @example
 *
 * const query = new Query(pageObjectNode, {
 *   selector: '.child-element',
 *   at: 2,
 * });
 * query.all();
 */
export class Query {
  /**
   *
   * @param {Ceibo} node - Node of the tree (required)
   * @param {Object|string} options - Additional options
   * @param {boolean} locator.resetScope - Do not use inherited scope
   * @param {string} locator.contains - Filter by using :contains('foo') pseudo-class
   * @param {number} locator.at - Filter by index using :eq(x) pseudo-class
   * @param {boolean} locator.last - Pick the last element
   * @param {boolean} locator.visible - Filter by using :visible pseudo-class
   * @param {Object|string} locator.selector - Query adapter specific selector
   * @param {boolean} locator.scope - Filter by using :visible pseudo-class
   * @param {boolean} locator.testContainer - Filter by using :visible pseudo-class
   */
  constructor(node, options) {
    const fullPath = allNodesFromTheRoot(node).map((node) => {
      return {
        scope: buildLocator(node.scope),
        resetScope: node.resetScope,
        testContainer: node.testContainer,
      };
    });

    this._testContainer =
      options?.testContainer ||
      fullPath.findLast((i) => i.testContainer !== undefined)?.testContainer;

    const leafLocator = buildLocator(options);
    if (leafLocator) {
      fullPath.push({
        scope: leafLocator,
      });
    }

    const resetScopeIndex = options?.resetScope
      ? fullPath.length - 1
      : fullPath.findLastIndex((i) => typeof i.resetScope === 'boolean');

    const locators = (
      resetScopeIndex === -1 ? fullPath : fullPath.slice(resetScopeIndex)
    )
      .map((p) => p.scope)
      .filter(Boolean)
      .reduce((acc, locator) => {
        if (acc.length === 0) {
          return [locator];
        }

        const lastLocator = acc[acc.length - 1];
        if (lastLocator.canConcat(locator)) {
          return [...acc.slice(0, -1), lastLocator.concat(locator)];
        }

        return [...acc, locator];
      }, []);

    this._locators = locators.length
      ? locators
      : [new Locator(':first-child', { at: 0 })];
  }

  all() {
    const rootElement = this._testContainer ?? getAdapter().testContainer;

    return this._locators.reduce(
      (queryRootElements, locator) => {
        return queryRootElements
          .map((rootElement) => {
            return locator.query(rootElement);
          })
          .flat();
      },
      [rootElement]
    );
  }

  toString() {
    return this._locators.map((p) => p.toString()).join(' ');
  }
}

function allNodesFromTheRoot(node) {
  const nodes = [];

  let iterator = node;
  do {
    nodes.unshift(iterator);
  } while ((iterator = Ceibo.parent(iterator)));

  return nodes;
}

function buildLocator(options) {
  if (!options) {
    return null;
  }

  if (typeof options === 'string' || options instanceof QuerySelector) {
    return new Locator(options, null);
  }

  if (options instanceof Locator) {
    return options;
  }

  const filters = extractFilterOptions(options);

  if (options.selector || filters) {
    return new Locator(options.selector, filters);
  }

  return null;
}

function extractFilterOptions(options) {
  const filters = {};

  if (options.at !== undefined) {
    if (typeof options.at !== 'number') {
      throw new Error('"at" must be a number');
    }

    filters.at = options.at;
  }

  if (options.last !== undefined) {
    if (typeof options.last !== 'boolean') {
      throw new Error('"last" must be a boolean');
    }

    filters.last = options.last;
  }

  if (options.visible !== undefined) {
    if (typeof options.visible !== 'boolean') {
      throw new Error('"visible" must be a boolean');
    }

    filters.visible = options.visible;
  }

  if (options.contains !== undefined) {
    if (typeof options.contains !== 'string') {
      throw new Error('"contains" must be a string');
    }

    filters.contains = options.contains;
  }

  return Object.keys(filters).length ? filters : null;
}
