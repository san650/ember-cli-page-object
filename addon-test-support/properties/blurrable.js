import { assign, buildSelector } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';
import { findElementWithAssert } from '../extend/index';
import { throwBetterError } from '../-private/better-errors';

/**
 *
 * Blurs element matched by selector.
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * import { create, blurrable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   blur: blurrable('.name')
 * });
 *
 * // blurs on element with selector '.name'
 * page.blur();
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * import { create, blurrable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   blur: blurrable('.name', { scope: '.scope' })
 * });
 *
 * // blurs on element with selector '.scope .name'
 * page.blur();
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * import { create, blurrable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   blur: blurrable('.name')
 * });
 *
 * // blurs on element with selector '.scope .name'
 * page.blur();
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element which will be blurred
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
*/
export function blurrable(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function() {
        const pageObjectKey = `${key}()`;

        const options = assign({ pageObjectKey }, userOptions);

        return getExecutionContext(this).runAsync((context) => {
          const element = findElementWithAssert(this, selector, options).get(0)

          return context.blur(element, options);
        }).then(_ =>_, (e) => {
          debugger
          throwBetterError(this, pageObjectKey, e, {
            selector: buildSelector(this, selector, options)
          });
        });
      };
    }
  };
}
