import { findElementWithAssert, map } from '../helpers';

/**
 * Gets the value of matched element or get Array of values of all matched elements
 *
 * @example
 *
 * // <input value="Lorem ipsum">
 *
 * var page = PageObject.create({
 *   value: PageObject.value('input')
 * });
 *
 * assert.equal(page.value, 'Lorem ipsum');
 *
 * @example
 *
 * // <input value="lorem">
 * // <input value="ipsum">
 *
 * let page = PageObject.create({
 *   value: PageObject.value('input', { multiple: true })
 * });
 *
 * assert.equal(page.value, ['lorem', 'ipsum']);
 *
 * @example
 *
 * // <div><input value="lorem"></div>
 * // <div class="scope"><input value="ipsum"></div>
 *
 * let page = PageObject.create({
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
 * let page = PageObject.create({
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
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.multiple - If set, the function will return an array of values
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function value(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var elements = findElementWithAssert(this, selector, options);
      var result;

      result = map(elements, function(element) {
        return element.val();
      });

      return options.multiple ? result : result[0];
    }
  };
}
