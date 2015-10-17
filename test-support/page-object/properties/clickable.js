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
 * @return {Object} target component (this allows chaining)
 */
function doClick(target, key, options) {
  let selector = qualifySelector(options.scope || target.scope, options.selector);

  click(selector);

  return target;
}

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
export default function clickable(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(doClick, options);
}
