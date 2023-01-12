import Selector from './query/selector';
import { getQueryEngine } from './query/engines';
import { isVisible, containsText } from './element';

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

function search(selector) {
  const { path, container } = selector;

  return path
    .reduce(
      (queryRootElements, subpath) => {
        return (
          queryRootElements
            .map((root) => {
              const selectors = subpath.map((locator) => locator.selector);

              debugger
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
