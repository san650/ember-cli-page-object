import { assign, getContext } from '../../helpers';
import acceptanceClick from './clickable/acceptance';
import integrationClick from './clickable/integration';

/**
 * Clicks elements matched by a selector.
 *
 * @example
 *
 * // <button class="continue">Continue<button>
 * // <button>Cancel</button>
 *
 * const page = PageObject.create({
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
 * const page = PageObject.create({
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
 * const page = PageObject.create({
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
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.visible - Make the action to raise an error if the element is not visible
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {String} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */
export function clickable(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function() {
        let context = getContext(this);
        let options = assign({ pageObjectKey: `${key}()` }, userOptions);

        if (context) {
          integrationClick(this, selector, options, context);
        } else {
          acceptanceClick(this, selector, options);
        }

        return this;
      };
    }
  };
}
