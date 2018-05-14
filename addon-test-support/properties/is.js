import { assign, every } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

/**
 * @public
 *
 * Validates if an element (or elements) matches a given selector.
 *
 * Useful for checking if an element (or elements) matches a selector like
 * `:disabled` or `:checked`, which can be the result of either an attribute
 * (`disabled="disabled"`, `disabled=true`) or a property (`disabled`).
 *
 * @example
 * // <input type="checkbox" checked="checked">
 * // <input type="checkbox" checked>
 *
 * import { create, is } from 'ember-cli-page-object';
 *
 * const page = create({
 *   areInputsChecked: is(':checked', 'input', { multiple: true })
 * });
 *
 * assert.equal(page.areInputsChecked, true, 'Inputs are checked');
 *
 * @example
 * // <button class="toggle-button active" disabled>Toggle something</button>
 *
 * import { create, is } from 'ember-cli-page-object';
 *
 * const page = create({
 *   isToggleButtonActive: is('.active:disabled', '.toggle-button')
 * });
 *
 * assert.equal(page.isToggleButtonActive, true, 'Button is active');
 *
 * @param {string} testSelector - CSS selector to test
 * @param {string} targetSelector - CSS selector of the element to check
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
export function is(testSelector, targetSelector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let executionContext = getExecutionContext(this);
      let options = assign({ pageObjectKey: key }, userOptions);

      return executionContext.run((context) => {
        let elements = context.findWithAssert(targetSelector, options);

        return every(elements, function(element) {
          return element.is(testSelector);
        });
      });
    }
  };
}
