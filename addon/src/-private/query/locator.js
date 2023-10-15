import { isVisible, containsText } from '../element';
import { QuerySelector } from './selector';
import JQueryQuerySelector from './selectors/jquery';

/**
 * Finds elements by `QuerySelector` and filters them.
 *
 * If the selector is not an instance of `QuerySelector`, it resolves
 * to the default `QuerySelector` class.
 */
export default class Locator {
  /**
   * @param {QuerySelector|String|Object} selector
   * @param {Object} filters Filters to apply to the selector results
   * @param {Boolean} filters.visible
   * @param {String} filters.contains
   * @param {Number} filters.at
   * @param {Boolean} filters.last
   *
   * @constructor
   */
  constructor(selector, filters) {
    if (selector instanceof QuerySelector) {
      this.selector = selector;
    } else {
      const SelectorClass = getDefaultQuerySelectorClass();

      this.selector = new SelectorClass(selector);
    }

    this.filters = filters;
  }

  /**
   * Returns a list of elements that match the selector.
   * It also filters elements found  by the filters passed in the constructor.
   *
   * @param {Element} container Element to search within
   *
   * @returns {Array<Element>} List of elements
   */
  query(container) {
    const elements = this.selector.query(container);

    // filter elements
    if (!this.filters) {
      return elements;
    }

    const { visible, contains } = this.filters;
    const filteredElements = elements.filter((element) => {
      if (visible && !isVisible(element)) {
        return false;
      }

      if (contains && !containsText(element, contains)) {
        return false;
      }

      return true;
    });

    // pick by index if specified
    const { at, last } = this.filters;
    return (
      last
        ? [filteredElements.pop()]
        : typeof at === 'number'
        ? [filteredElements[at]]
        : filteredElements
    ).filter(Boolean);
  }

  /**
   * Returns a string representation for the selector with filters.
   *
   * Useful for the test reporter.
   *
   * @returns {String}
   */
  toString() {
    const { filters, selector } = this;
    if (!filters) {
      return selector.toString();
    }

    const modifiers = [];
    if (filters.visible) {
      modifiers.push(`visible`);
    }

    if (filters.contains) {
      modifiers.push(`contains("${filters.contains}")`);
    }

    if (typeof filters.at === 'number') {
      modifiers.push(`eq(${filters.at})`);
    } else if (filters.last) {
      modifiers.push('last');
    }

    if (!modifiers.length) {
      return selector;
    }

    return `${selector}:${modifiers.join(':')}`;
  }

  /**
   * Answers if the current locator can concatenate with another locator.
   * It is only possible to concatenate locators if the current locator
   * does not have any filters.
   *
   * @param {Locator} locator
   *
   * @returns {Boolean}
   */
  canConcat(locator) {
    // in case of filters we need to transfer control to the Locator.
    // so it can filter the elements before continue querying further.
    if (this.filters) {
      return false;
    }

    return this.selector.canConcat(locator.selector);
  }

  /**
   * Returns a new locator that is the result of merging the current locator
   * with the passed locator.
   *
   * @example
   *
   *  ```html
   *  <div class="modal">
   *    <input class="project-name">
   *  </div>
   *
   *  const modal = create({
   *    scope: '.modal',
   *    projectName: {
   *      scope: '.project-name',
   *    }
   *  });
   *  ```
   *
   *  ```js
   *  await modal.projectName.fillIn('Project Name');
   *  ```
   *
   *  will result in a single query:
   *
   *  `.modal .project-name`
   *
   *  instead of doing two consequent queries, one for each scope.
   *
   * @param {Locator} locator
   *
   * @returns {Locator} A new locator
   */
  concat(locator) {
    return new Locator(this.selector.concat(locator.selector), locator.filters);
  }
}

function getDefaultQuerySelectorClass() {
  return JQueryQuerySelector;
}
