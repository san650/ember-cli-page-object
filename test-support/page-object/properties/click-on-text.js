import Ember from 'ember';
import { buildSelector, getContext } from '../helpers';

var { merge } = Ember;

/**
 * Creates an action to click an element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     clickOn: clickOnText('body')
 *   });
 *
 *   page.clickOn('Save');
 *
 * @param {string} selector - CSS selector of the element to click
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @return {Descriptor}
 */
export function clickOnText(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToClick) {
      // Suppose that we have something like `<form><button>Submit</button></form>`
      // In this case <form> and <button> elements contains "Submit" text, so, we'll
      // want to __always__ click on the __last__ element that contains the text.
      var selectorWithSpace = (selector || '') + ' ';
      var fullSelector = buildSelector(
        this,
        selectorWithSpace,
        merge({ contains: textToClick, last: true }, options));
      var context = getContext(this);

      if (context) {
        Ember.run(() => {
          context.$(fullSelector).click();
        });
      } else {
        /* global click */
        click(fullSelector);
      }

      return this;
    }
  };
}
