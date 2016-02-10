import { findElementWithAssert, map, normalizeText } from '../helpers';

/**
 * Gets text of the matched element or elements
 *
 * @example
 *
 * // Hello <span>world!</span>
 *
 * let page = PageObject.create({
 *   text: PageObject.text('span')
 * });
 *
 * // returns 'world!'
 * page.text
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * let page = PageObject.create({
 *   text: PageObject.text('span', { scope: '.scope' })
 * });
 *
 * // returns 'ipsum'
 * page.text
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * let page = PageObject.create({
 *   scope: '.scope',
 *   text: PageObject.text('span')
 * });
 *
 * // returns 'ipsum'
 * page.text
 *
 * @example
 *
 * // <div class="other"><span>lorem</span></div>
 * // <div class="scope"><span> ipsum </span></div>
 *
 * let page = create({
 *   scope: '.scope',
 *   text: text('span', { scope: '.other', resetScope: true })
 * });
 *
 * // returns 'lorem'
 * page.text
 *
 * @example
 *
 * // <span>lorem</span>
 * // <span> ipsum </span>
 * // <span>dolor</span>
 *
 * var page = PageObject.create({
 *   text: PageObject.text('span', { at: 1 })
 * });
 *
 * // returns 'ipsum'
 * page.text
 *
 * @example
 *
 * // <span>lorem</span>
 * // <span> ipsum </span>
 * // <span>dolor</span>
 *
 * var page = PageObject.create({
 *   texts: PageObject.text('span', { multiple: true })
 * });
 *
 * // returns ['lorem', 'ipsum', 'dolor']
 * page.texts
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Return an array of values
 * @return {Descriptor} - Descriptor which returns text of matched element or array of texts of matched elements.
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple options is not set
 */
export function text(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var elements = findElementWithAssert(this, selector, options);
      var result;

      result = map(elements, function(element) {
        return normalizeText(element.text());
      });

      return options.multiple ? result : result[0];
    }
  };
}
