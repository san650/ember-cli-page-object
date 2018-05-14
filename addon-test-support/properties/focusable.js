import { assign } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

/**
 *
 * Focuses element matched by selector.
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * import { create, focusable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   focus: focusable('.name')
 * });
 *
 * // focuses on element with selector '.name'
 * page.focus();
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * import { create, focusable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   focus: focusable('.name', { scope: '.scope' })
 * });
 *
 * // focuses on element with selector '.scope .name'
 * page.focus();
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * import { create, focusable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   focus: focusable('.name')
 * });
 *
 * // focuses on element with selector '.scope .name'
 * page.focus();
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element which will be focused
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
*/
export function focusable(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function() {
        const executionContext = getExecutionContext(this);
        const options = assign({ pageObjectKey: `${key}()` }, userOptions);

        return executionContext.runAsync((context) => {
          return context.focus(selector, options);
        });
      };
    }
  };
}
