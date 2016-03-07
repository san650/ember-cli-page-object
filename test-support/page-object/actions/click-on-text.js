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
 * Clicks on an element containing specified text.
 *
 * The element can either match a specified selector,
 * or be inside an element matching the specified selector.
 *
 * @example
 *
 * // <fieldset>
 * //  <button>Lorem</button>
 * //  <button>Ipsum</button>
 * // </fieldset>
 *
 * const page = PageObject.create({
 *   clickOnFieldset: PageObject.clickOnText('fieldset'),
 *   clickOnButton: PageObject.clickOnText('button')
 * });
 *
 * // queries the DOM with selector 'fieldset :contains("Lorem"):last'
 * page.clickOnFieldset('Lorem');
 *
 * // queries the DOM with selector 'button:contains("Ipsum")'
 * page.clickOnButton('Ipsum');
 *
 * @example
 *
 * // <div class="scope">
 * //   <fieldset>
 * //    <button>Lorem</button>
 * //    <button>Ipsum</button>
 * //   </fieldset>
 * // </div>
 *
 * const page = PageObject.create({
 *   clickOnFieldset: PageObject.clickOnText('fieldset', { scope: '.scope' }),
 *   clickOnButton: PageObject.clickOnText('button', { scope: '.scope' })
 * });
 *
 * // queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
 * page.clickOnFieldset('Lorem');
 *
 * // queries the DOM with selector '.scope button:contains("Ipsum")'
 * page.clickOnButton('Ipsum');
 *
 * @example
 *
 * // <div class="scope">
 * //   <fieldset>
 * //    <button>Lorem</button>
 * //    <button>Ipsum</button>
 * //   </fieldset>
 * // </div>
 *
 * const page = PageObject.create({
 *   scope: '.scope',
 *   clickOnFieldset: PageObject.clickOnText('fieldset'),
 *   clickOnButton: PageObject.clickOnText('button')
 * });
 *
 * // queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
 * page.clickOnFieldset('Lorem');
 *
 * // queries the DOM with selector '.scope button:contains("Ipsum")'
 * page.clickOnButton('Ipsum');
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element in which to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
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
