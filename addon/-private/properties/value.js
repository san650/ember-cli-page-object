import {
  assign,
  map,
  registerPropWithCustomFalsyValues
} from '../helpers';
import { getExecutionContext } from '../execution_context';

/**
 * @public
 *
 * Returns the value of a matched element, or an array of values of all
 * matched elements. If a matched element is contenteditable, this helper
 * will return the html content of the element.
 *
 * @example
 *
 * // <input value="Lorem ipsum">
 *
 * const page = PageObject.create({
 *   value: PageObject.value('input')
 * });
 *
 * assert.equal(page.value, 'Lorem ipsum');
 *
 * @example
 *
 * // <div contenteditable="true"><b>Lorem ipsum</b></div>
 *
 * const page = PageObject.create({
 *   value: PageObject.value('[contenteditable]')
 * });
 *
 * assert.equal(page.value, '<b>Lorem ipsum</b>');
 *
 * @example
 *
 * // <input value="lorem">
 * // <input value="ipsum">
 *
 * const page = PageObject.create({
 *   value: PageObject.value('input', { multiple: true })
 * });
 *
 * assert.deepEqual(page.value, ['lorem', 'ipsum']);
 *
 * @example
 *
 * // <div><input value="lorem"></div>
 * // <div class="scope"><input value="ipsum"></div>
 *
 * const page = PageObject.create({
 *   value: PageObject.value('input', { scope: '.scope' })
 * });
 *
 * assert.equal(page.value, 'ipsum');
 *
 * @example
 *
 * // <div><input value="lorem"></div>
 * // <div class="scope"><input value="ipsum"></div>
 *
 * const page = PageObject.create({
 *   scope: '.scope',
 *   value: PageObject.value('input')
 * });
 *
 * assert.equal(page.value, 'ipsum');
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.multiple - If set, the function will return an array of values
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function value(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    setup(target, key) {
      if (userOptions.falsy) {
        registerPropWithCustomFalsyValues(target, key, userOptions.falsy);
      }
    },

    get(key) {
      let executionContext = getExecutionContext(this);
      let options = assign({ pageObjectKey: key }, userOptions);

      return executionContext.run((context) => {
        let elements = context.findWithAssert(selector, options);
        let result;

        result = map(elements, function(element) {
          if (element.is('[contenteditable]')) {
            return element.html();
          } else {
            return element.val();
          }
        });

        return options.multiple ? result : result[0];
      });
    }
  };
}
