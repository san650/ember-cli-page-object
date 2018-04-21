import { assign, findClosestValue } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';
import { buildSelector } from './click-on-text/helpers';

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
 * import { create, clickOnText } from 'ember-cli-page-object';
 *
 * const page = create({
 *   clickOnFieldset: clickOnText('fieldset'),
 *   clickOnButton: clickOnText('button')
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
 * import { create, clickOnText } from 'ember-cli-page-object';
 *
 * const page = create({
 *   clickOnFieldset: clickOnText('fieldset', { scope: '.scope' }),
 *   clickOnButton: clickOnText('button', { scope: '.scope' })
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
 * import { create, clickOnText } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   clickOnFieldset: clickOnText('fieldset'),
 *   clickOnButton: clickOnText('button')
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
 * @param {boolean} options.visible - Make the action to raise an error if the element is not visible
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */
export function clickOnText(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function(textToClick) {
        let executionContext = getExecutionContext(this);
        let options = assign({ pageObjectKey: `${key}("${textToClick}")`, contains: textToClick }, userOptions);

        return executionContext.runAsync((context) => {
          let fullSelector = buildSelector(this, context, selector, options);
          let container = options.testContainer || findClosestValue(this, 'testContainer');

          context.assertElementExists(fullSelector, options);

          return context.click(fullSelector, container, options);
        });
      };
    }
  };
}
