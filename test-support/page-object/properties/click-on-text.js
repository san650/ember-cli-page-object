import Ember from 'ember';
import { buildSelector, getContext } from '../helpers';

/* global wait, find, click */

var { merge } = Ember;

function findChildElement(tree, selector, textToClick, options) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  var selectorWithSpace = (selector || '') + ' ';
  var fullSelector = buildSelector(tree, selectorWithSpace, merge({ contains: textToClick, last: true }, options));

  if (find(fullSelector).length) {
    return fullSelector;
  }
}

function findElement(tree, selector, textToClick, options) {
  var fullSelector = buildSelector(tree, selector, merge({ contains: textToClick }, options));

  return fullSelector;
}

function actualSelector(tree, selector, textToClick, options) {
  var childElement = findChildElement(tree, selector, textToClick, options);

  return childElement || findElement(tree, selector, textToClick, options);
}

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
      var context = getContext(this);

      if (context) {
        Ember.run(() => {
          var fullSelector = actualSelector(this, selector, textToClick, options);

          context.$(fullSelector).click();
        });
      } else {
        wait().then(() => {
          var fullSelector = actualSelector(this, selector, textToClick, options);

          click(fullSelector);
        });
      }

      return this;
    }
  };
}
