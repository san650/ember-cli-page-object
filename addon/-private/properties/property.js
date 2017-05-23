import {
  assign,
  map,
  registerPropWithCustomFalsyValues
} from '../helpers';
import { getExecutionContext } from '../execution_context';

/**
 * @public
 *
 * Returns the value of a property from the matched element, or an array of
 * values from multiple matched elements.
 *
 * @example
 * // <input type="checkbox" checked="checked">
 *
 * const page = PageObject.create({
 *   isChecked: PageObject.property('checked', 'input')
 * });
 *
 * assert.ok(page.isChecked);
 *
 * @example
 *
 * // <input type="checkbox" checked="checked">
 * // <input type="checkbox" checked="">
 *
 * const page = PageObject.create({
 *   inputsChecked: PageObject.property('checked', 'input', { multiple: true })
 * });
 *
 * assert.deepEqual(page.inputsChecked, [true, false]);
 *
 * @example
 *
 * // <div><input></div>
 * // <div class="scope"><input type="checkbox" checked="checked"></div>
 * // <div><input></div>
 *
 * const page = PageObject.create({
 *   isChecked: PageObject.property('checked', 'input', { scope: '.scope' })
 * });
 *
 * assert.ok(page.isChecked);
 *
 * @public
 *
 * @param {string} propertyName - Name of the property to get
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.multiple - If set, the function will return an array of values
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function property(propertyName, selector, userOptions = {}) {
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
          return element.prop(propertyName);
        });

        return options.multiple ? result : result[0];
      });
    }
  };
}
