import { assign, every } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

/**
 * Validates if an element or set of elements are visible.
 *
 * @example
 *
 * // Lorem <span>ipsum</span>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsVisible: isVisible('span')
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span style="display:none">dolor</span>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spansAreVisible: isVisible('span', { multiple: true })
 * });
 *
 * // not all spans are visible
 * assert.notOk(page.spansAreVisible);
 *
 * @example
 *
 * // <span>ipsum</span>
 * // <span>dolor</span>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spansAreVisible: isVisible('span', { multiple: true })
 * });
 *
 * // all spans are visible
 * assert.ok(page.spansAreVisible);
 *
 * @example
 *
 * // Lorem <strong>ipsum</strong>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsVisible: isVisible('span')
 * });
 *
 * // returns false when element doesn't exist in DOM
 * assert.notOk(page.spanIsVisible);
 *
 * @example
 *
 * // <div>
 * //   <span style="display:none">lorem</span>
 * // </div>
 * // <div class="scope">
 * //   <span>ipsum</span>
 * // </div>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanIsVisible: isVisible('span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @example
 *
 * // <div>
 * //   <span style="display:none">lorem</span>
 * // </div>
 * // <div class="scope">
 * //   <span>ipsum</span>
 * // </div>
 *
 * import { create, isVisible } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanIsVisible: isVisible('span')
 * });
 *
 * assert.ok(page.spanIsVisible);
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector are visible
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function isVisible(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let executionContext = getExecutionContext(this);
      let options = assign({ pageObjectKey: key }, userOptions);

      return executionContext.run((context) => {
        let elements = context.find(selector, options);

        if (elements.length === 0) {
          return false;
        }

        return every(elements, function(element) {
          return element.is(':visible');
        });
      });
    }
  };
}
