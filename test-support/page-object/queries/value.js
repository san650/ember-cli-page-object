import { findElementWithAssert, map } from '../helpers';

/**
 * Returns the value of a matched element,
 * or an array of values of all matched elements.
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
