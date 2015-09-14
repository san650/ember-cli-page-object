/* global click */

import Descriptor from '../descriptor';
import { qualifySelector } from '../helpers';

/**
 * Clicks an element
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} options.selector - CSS selector of the element to click
 * @param {string} options.scope - Overrides parent scope
 * @param {string} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Promise}
 */
function doClick(target, key, options) {
  let selector = qualifySelector(options.scope || target.scope, options.selector);

  return click(selector);
}

/**
 * Creates an action to click an element
 *
 * @example
 *
 *   var page = PageObject.build({
 *     submit: clickable('button[type=submit]')
 *   });
 *
 *   page.submit();
 *
 * @param {string} selector - CSS selector of the element to click
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {string} options.index - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export default function clickable(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(doClick, options);
}
