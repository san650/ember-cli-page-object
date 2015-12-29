/* global click */

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
 * @return {Descriptor}
 */
export function clickable(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      click(buildSelector(this, selector, options));

      return this;
    }
  }
}
