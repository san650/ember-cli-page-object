import Ember from 'ember';
import { buildSelector, getContext } from '../helpers';

/* global wait, find, click */

const { assert, merge, run } = Ember;

function findChildElement(tree, selector, textToClick, options) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  var selctorWithSpace = (selector || '') + ' ';
  var fullSelector = buildSelector(tree, selctorWithSpace, merge({ contains: textToClick, last: true }, options));

  if (find(fullSelector).length) {
    return fullSelector;
  }
}

function findElement(tree, selector, textToClick, options) {
  var fullSelector = buildSelector(tree, selector, merge({ contains: textToClick }, options));

  return fullSelector;
}

function clickForAcceptance(tree, selector, textToClick, options) {
  wait().then(function() {
    var actualSelector = findChildElement(tree, selector, textToClick, options) || findElement(tree, selector, textToClick, options);

    click(actualSelector);
  });
}

function clickForIntegration(tree, selector, textToClick, options) {
  var context = getContext(tree);

  // FIXME: improve message and test this case
  assert('You need to set `context` in component integration tests', context);

  run(function() {
    var actualSelector = findChildElement(tree, selector, textToClick, options) || findElement(tree, selector, textToClick, options);

    context.$(actualSelector).click();
  });
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
      if (typeof(click) === 'function') {
        clickForAcceptance(this, selector, textToClick, options);
      } else {
        clickForIntegration(this, selector, textToClick, options);
      }

      return this;
    }
  };
}
