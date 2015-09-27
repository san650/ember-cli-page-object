/* global fillIn */

import Descriptor from '../descriptor';
import { qualifySelector } from '../helpers';

/**
 * Fills in an input
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} options.selector - CSS selector of the element to fill
 * @param {string} options.scope - Overrides parent scope
 * @param {string} textToUse - Text to use to fill the input
 * @return {Object} target component (this allows chaining)
 */
function doFillIn(target, key, options, textToUse) {
  let selector = qualifySelector(options.scope || target.scope, options.selector);

  fillIn(selector, textToUse);

  return target;
}

/**
 * Creates an action to fill in an input
 *
 * @example
 *
 *   var page = PO.build({
 *     name: fillable('#name')
 *   });
 *
 *   page.name('John Doe');
 *
 * @param {string} selector - CSS selector of the element to fill
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @return {Descriptor}
 */
export default function fillable(selector, options = {}) {
  options.selector = selector;

  return new Descriptor(doFillIn, options);
}
