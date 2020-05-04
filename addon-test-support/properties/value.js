import { assign } from '../-private/helpers';
import { findOne } from '../extend';
import $ from '-jquery';

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
 * import { create, value } from 'ember-cli-page-object';
 *
 * const page = create({
 *   value: value('input')
 * });
 *
 * assert.equal(page.value, 'Lorem ipsum');
 *
 * @example
 *
 * // <div contenteditable="true"><b>Lorem ipsum</b></div>
 *
 * import { create, value } from 'ember-cli-page-object';
 *
 * const page = create({
 *   value: value('[contenteditable]')
 * });
 *
 * assert.equal(page.value, '<b>Lorem ipsum</b>');
 *
 * @example
 *
 * // <div><input value="lorem"></div>
 * // <div class="scope"><input value="ipsum"></div>
 *
 * import { create, value } from 'ember-cli-page-object';
 *
 * const page = create({
 *   value: value('input', { scope: '.scope' })
 * });
 *
 * assert.equal(page.value, 'ipsum');
 *
 * @example
 *
 * // <div><input value="lorem"></div>
 * // <div class="scope"><input value="ipsum"></div>
 *
 * import { create, value } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   value: value('input')
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
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function value(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);

      const element = findOne(this, selector, options);

      return element.hasAttribute('contenteditable') ? $(element).html() : $(element).val();
    }
  };
}
