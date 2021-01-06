import { assign } from '../-private/helpers';
import { findOne } from '../extend';
import $ from '-jquery';

/**
 * @public
 *
 * Returns the value of a property from the matched element.
 *
 * @example
 * // <input type="checkbox" checked="checked">
 *
 * import { create, property } from 'ember-cli-page-object';
 *
 * const page = create({
 *   isChecked: property('checked', 'input')
 * });
 *
 * assert.ok(page.isChecked);
 *
 * @example
 *
 * // <div><input></div>
 * // <div class="scope"><input type="checkbox" checked="checked"></div>
 * // <div><input></div>
 *
 * import { create, property } from 'ember-cli-page-object';
 *
 * const page = create({
 *   isChecked: property('checked', 'input', { scope: '.scope' })
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
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function property(propertyName, selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);

      return $(findOne(this, selector, options)).prop(propertyName);
    }
  };
}
