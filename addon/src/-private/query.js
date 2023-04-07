import Ceibo from '@ro0gr/ceibo';
import { getAdapter } from 'ember-cli-page-object/adapters';
import Selector from './query/selector';
import { getQueryEngine } from './query/engines';
import { isVisible, containsText } from './element';

/**
 * @public
 *
 * DOM Elements Query.
 *
 * @example
 *
 * const query = new Query(pageObjectNode, '.child-element');
 * query.all();
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
 * @param {Object|string} locator - Additional options
 * @param {boolean} locator.resetScope - Do not use inherited scope
 * @param {string} locator.contains - Filter by using :contains('foo') pseudo-class
 * @param {number} locator.at - Filter by index using :eq(x) pseudo-class
 * @param {boolean} locator.last - Filter by using :last pseudo-class
 * @param {boolean} locator.visible - Filter by using :visible pseudo-class
 * @param {boolean} locator.selector - Filter by using :visible pseudo-class
 * @param {boolean} locator.scope - Filter by using :visible pseudo-class
 * @param {boolean} locator.testContainer - Filter by using :visible pseudo-class
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
    const elements = search(this.container, this.selector.path);

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

  get container() {
    const { locator } = this.selector;

    return (
      (locator && locator.testContainer) ||
      findClosestValue(this.node, 'testContainer') ||
      getAdapter().testContainer
    );
  }

  // @todo: tests for filters via findOne
  toString() {
    return this.selector.toString();
  }
}

function search(container, path) {
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

function findClosestValue(node, property) {
  if (typeof node[property] !== 'undefined') {
    return node[property];
  }

  let parent = Ceibo.parent(node);

  if (typeof parent !== 'undefined') {
    return findClosestValue(parent, property);
  }
}
