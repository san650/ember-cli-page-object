import { assign, every } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

/**
 * @public
 *
 * Validates if an element or a set of elements don't have a given CSS class.
 *
 * @example
 *
 * // <em class="lorem"></em><span class="success">Message!</span>
 *
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messageIsSuccess: notHasClass('error', 'span')
 * });
 *
 * assert.ok(page.messageIsSuccess);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="error"></span>
 *
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messagesAreSuccessful: notHasClass('error', 'span', { multiple: true })
 * });
 *
 * // one span has error class
 * assert.notOk(page.messagesAreSuccessful);
 *
 * @example
 *
 * // <span class="success"></span>
 * // <span class="success"></span>
 *
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   messagesAreSuccessful: notHasClass('error', 'span', { multiple: true })
 * });
 *
 * // no spans have error class
 * assert.ok(page.messagesAreSuccessful);
 *
 * @example
 *
 * // <div>
 * //   <span class="lorem"></span>
 * // </div>
 * // <div class="scope">
 * //   <span class="ipsum"></span>
 * // </div>
 *
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   spanNotHasClass: notHasClass('lorem', 'span', { scope: '.scope' })
 * });
 *
 * assert.ok(page.spanNotHasClass);
 *
 * @example
 *
 * // <div>
 * //   <span class="lorem"></span>
 * // </div>
 * // <div class="scope">
 * //   <span class="ipsum"></span>
 * // </div>
 *
 * import { create, notHasClass } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   spanNotHasClass: notHasClass('lorem', 'span')
 * });
 *
 * assert.ok(page.spanNotHasClass);
 *
 * @public
 *
 * @param {string} cssClass - CSS class to be validated
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.multiple - Check if all elements matched by selector don't have the CSS class
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function notHasClass(cssClass, selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let executionContext = getExecutionContext(this);
      let options = assign({ pageObjectKey: key }, userOptions);

      return executionContext.run((context) => {
        let elements = context.findWithAssert(selector, options);

        return every(elements, function(element) {
          return !element.hasClass(cssClass);
        });
      });
    }
  };
}
