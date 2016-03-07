import Ember from 'ember';
import { findElement, findElementWithAssert, buildSelector, getContext } from '../helpers';

/* global wait, find, click */

var { merge } = Ember;

function childSelector(tree, selector, textToClick, options) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  var selectorWithSpace = (selector || '') + ' ';
  var opts = merge({ contains: textToClick, last: true, multiple: true }, options);
  var fullSelector = buildSelector(tree, selectorWithSpace, opts);

  if (findElement(tree, selectorWithSpace, opts).length) {
    return fullSelector;
  }
}

function actualSelector(tree, selector, textToClick, options) {
  var childSel = childSelector(tree, selector, textToClick, options);

  if (childSel) {
    return childSel;
  } else {
    return buildSelector(tree, selector, merge({ contains: textToClick }, options));
  }
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

      if (context && findElementWithAssert(this, selector)) {
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
