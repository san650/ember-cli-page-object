/* global click */

import Descriptor from '../descriptor';
import { qualifySelector } from '../helpers';

/**
 * Clicks an element by text
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} options.selector - CSS selector of the container of the element to click
 * @param {string} options.scope - Overrides parent scope
 * @param {string} textToClick - Text to find the element to click
 * @return {Promise}
 */
function doClick(target, key, options, textToClick) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  let selector = qualifySelector(
    options.scope || target.scope,
    options.selector,
    `:contains("${textToClick}"):last`
  );

  click(selector);

  return target;
}

/**
 * Creates an action to click an element
 *
 * @example
 *
 *   var page = PageObject.build({
 *     click: clickOnText('button[type=submit]')
 *   });
 *
 *   page.click('Save');
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
