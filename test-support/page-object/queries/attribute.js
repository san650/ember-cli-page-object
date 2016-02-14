import { findElementWithAssert, map } from '../helpers';

/**
 * Gets the value of an attribute from matched element or Array of value of
 * attributes of multiple matched elements
 *
 * @example
 * // <input placeholder="a value">
 *
 * var page = PageObject.create({
 *   inputPlaceHolder: PageObject.attribute('placeholder', 'input')
 * });
 *
 * assert.equal(page.inputPlaceHolder, 'a value');
 *
 * @example
 *
 * // <input placeholder="a value">
 * // <input placeholder="other value">
 *
 * let page = PageObject.create({
 *   inputPlaceHolder: PageObject.attribute('placeholder', ':input', { multiple: true })
 * });
 *
 * assert.equal(page.inputPlaceHolder, ['a value', 'other value']);
 *
 * @example
 *
 * // <div><input></div>
 * // <div class="scope"><input placeholder="a value"></div>
 * // <div><input></div>
 *
 * let page = PageObject.create({
 *   inputPlaceHolder: PageObject.attribute('placeholder', ':input', { scope: '.scope' })
 * });
 *
 * assert.equal(page.inputPlaceHolder, 'a value');
 *
 * @example
 *
 * // <div><input></div>
 * // <div class="scope"><input placeholder="a value"></div>
 * // <div><input></div>
 *
 * let page = PageObject.create({
 *   scope: 'scope',
 *   inputPlaceHolder: PageObject.attribute('placeholder', ':input')
 * });
 *
 * assert.equal(page.inputPlaceHolder, 'a value');
 *
 * @public
 *
 * @param {string} attributeName - Name of the attribute to get
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.multiple - If set, the function will return an array of values
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function attribute(attributeName, selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var elements = findElementWithAssert(this, selector, options);
      var result;

      result = map(elements, function(element) {
        return element.attr(attributeName);
      });

      return options.multiple ? result : result[0];
    }
  };
}
