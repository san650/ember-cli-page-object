import { buildSelector } from '../helpers';

/**
 * Clicks element matched by selector
 *
 * @example
 *
 * // <button class="continue">Continue<button>
 * // <button>Cancel</button>
 *
 * var page = PageObject.create({
 *   continue: clickable('button.continue')
 * });
 *
 * // clicks on element with selector 'button.continue'
 * page.continue();
 *
 * @example
 *
 * // <div class="scope">
 * //   <button>Continue<button>
 * // </div>
 * // <button>Cancel</button>
 *
 * var page = PageObject.create({
 *   continue: clickable('button.continue', { scope: '.scope' })
 * });
 *
 * // clicks on element with selector '.scope button.continue'
 * page.continue();
 *
 * @example
 *
 * // <div class="scope">
 * //   <button>Continue<button>
 * // </div>
 * // <button>Cancel</button>
 *
 * var page = PageObject.create({
 *   scope: '.scope',
 *   continue: clickable('button.continue')
 * });
 *
 * // clicks on element with selector '.scope button.continue'
 * page.continue();
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to click
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope with parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */


export function clickable(selector, options = {}) {
  return {
    isDescriptor: true,

    value() {
      /* global click */
      click(buildSelector(this, selector, options));

      return this;
    }
  };
}
