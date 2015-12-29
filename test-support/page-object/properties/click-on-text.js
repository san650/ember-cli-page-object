/* global click */

import { buildSelector } from '../helpers';

/**
 * Creates an action to click an element
 *
 * @example
 *
 *   var page = PageObject.create({
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
export function clickOnText(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToClick) {
      // Suppose that we have something like `<form><button>Submit</button></form>`
      // In this case <form> and <button> elements contains "Submit" text, so, we'll
      // want to __always__ click on the __last__ element that contains the text.

      let clickableSelector = `${buildSelector(this, selector, options)} :contains("${textToClick}"):last`;

      click(clickableSelector);

      return this;
    }
  };
}
