import { getExecutionContext } from '../execution_context';
import {
  assign,
  buildSelector,
  simpleFindElementWithAssert
} from '../../helpers';

/**
 * Alias for `fillable`, which works for inputs and HTML select menus.
 *
 * [See `fillable` for usage examples.](#fillable)
 *
 * @name selectable
 * @function
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {String} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */

/**
 * Fills in an input matched by a selector.
 *
 * @example
 *
 * // <input value="">
 *
 * const page = PageObject.create({
 *   fillIn: PageObject.fillable('input')
 * });
 *
 * // result: <input value="John Doe">
 * page.fillIn('John Doe');
 *
 * @example
 *
 * // <div class="name">
 * //   <input value="">
 * // </div>
 * // <div class="last-name">
 * //   <input value= "">
 * // </div>
 *
 * const page = PageObject.create({
 *   fillInName: PageObject.fillable('input', { scope: '.name' })
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @example
 *
 * // <div class="name">
 * //   <input value="">
 * // </div>
 * // <div class="last-name">
 * //   <input value= "">
 * // </div>
 *
 * const page = PageObject.create({
 *   scope: 'name',
 *   fillInName: PageObject.fillable('input')
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {String} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */
export function fillable(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function(text) {
        let executionContext = getExecutionContext(this);
        let options = assign({ pageObjectKey: `${key}()` }, userOptions);

        executionContext.run((context) => {
          let fullSelector = buildSelector(this, selector, options);

          // Run this to validate if the element exists
          simpleFindElementWithAssert(this, fullSelector, options);

          context.fillIn(fullSelector, options.testContainer, text);
        });

        return this;
      };
    }
  };
}
