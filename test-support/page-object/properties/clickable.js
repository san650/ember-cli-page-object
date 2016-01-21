import { buildSelector } from '../helpers';

/**
 * Creates an action to click an element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     submit: clickable('button[type=submit]')
 *   });
 *
 *   page.submit();
 *
 * @param {string} selector - CSS selector of the element to click
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function clickable(selector, options = {}) {
  return {
    isDescriptor: true,

    value() {
      /* global click */
      click(buildSelector(this, selector, options));

      return this;
    }
  }
}
