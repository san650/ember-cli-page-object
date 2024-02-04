/**
 * Base class for all selectors.
 * A selector is responsible for finding elements in the DOM.
 * It is used by the Locator class.
 *
 * @param {String} selector
 */
export class QuerySelector {
  constructor(selector) {
    this.selector = selector;
  }

  /**
   * Returns a list of elements that match the selector.
   *
   * @param {Element} containerElement Element to search within
   *
   * @returns {Array<Element>} List of elements
   */
  query(/* containerElement */) {
    throw new Error('`query` method is not implemented');
  }

  /**
   * Returns a string representation of the selector. Useful for the test reporter.
   *
   * @returns {String}
   */
  toString() {
    return this.selector.toString();
  }

  /**
   * Answers if the current selector type can merge with another selector.
   * This allows reducing the number of queries done by the parent Locator
   * by combining multiple selectors into one.
   *
   * @param {QuerySelector} selector
   *
   * @returns {Boolean}
   */
  canConcat(/* selector */) {
    return false;
  }

  /**
   * Returns a new selector that is the result of merging the current selector
   * with the passed selector.
   *
   * @param {QuerySelector} selector
   *
   * @returns {QuerySelector} A new selector
   */
  concat(/* selector */) {
    throw new Error('`concat` method is not implemented');
  }
}

export function isQuerySelector(selector) {
  return selector instanceof QuerySelector;
}
