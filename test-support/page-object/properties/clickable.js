/* global click */

import { calculateScope, normalizeText } from '../helpers';

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
      let clickableSelector = normalizeText(`${calculateScope(this, options.scope)} ${selector}`);

      click(clickableSelector);

      return this;
    }
  }
}
