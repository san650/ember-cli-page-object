import { findElementWithAssert, map } from '../helpers';

/**
 * Gets the value of an attribute from an element
 *
 * @example
 * // <input placeholder="a value">
 *
 * var page = PageObject.create({
 *   inputPlaceHolder: PageObject.attribute('placeholder', 'input')
 * });
 *
 * // returns 'a value'
 * page.inputPlaceHolder;
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
 * // returns 'a value'
 * page.inputPlaceHolder
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
 * // returns 'a value'
 * page.inputPlaceHolder
 *
 * @example
 *
 * // <div class="scope"></div>
 * // <div><input placeholder="a value"></div>
 *
 * let page = PageObject.create({
 *   scope: '.scope',
 *
 *   inputPlaceHolder: PageObject.attribute('placeholder', ':input', { resetScope: true })
 * });
 *
 * // returns 'a value'
 * page.inputPlaceHolder
 *
 * @example
 *
 * // <input>
 * // <input placeholder="a value">
 *
 * let page = PageObject.create({
 *   inputPlaceHolder: PageObject.attribute('placeholder', ':input', { at: 1 })
 * });
 *
 * // returns 'a value'
 * page.inputPlaceHolder
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
 * // returns ['a value', 'other value']
 * page.inputPlaceHolder
 *
 * @param {string} attributeName - Name of the attribute to get
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.multiple - If set, the function will return an array of values
 * @return {Descriptor} - Descriptor which returns the value of attribute of matched element or Array of value of attributes of all matched elements
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
