import { buildSelector } from '../helpers';

/**
 * Fills an input matched by selector
 *
 * @example
 *
 * // <input value="">
 *
 * var page = PageObject.create({
 *   fillIn: PageObject.fillable('input')
 * });
 *
 * // result: <input value="John Doe">
 * page.fillIn('John Doe');
 *
 * @example
 *
 * // <div class="name">
 * //   <input value="">
 * // </div>
 * // <div class="last-name">
 * //   <input value= "">
 * // </div>
 *
 * var page = PageObject.create({
 *   fillInName: PageObject.fillable('input', { scope: '.name' })
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @example
 *
 * // <div class="name">
 * //   <input value="">
 * // </div>
 * // <div class="last-name">
 * //   <input value= "">
 * // </div>
 *
 * var page = PageObject.create({
 *   scope: 'name',
 *   fillInName: PageObject.fillable('input')
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @return {Descriptor}
 */
export function fillable(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToUse) {
      /* global fillIn */
      fillIn(buildSelector(this, selector, options), textToUse);

      return this;
    }
  }
}
