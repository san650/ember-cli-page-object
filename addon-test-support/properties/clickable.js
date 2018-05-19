import {
  assign,
  buildSelector,
  findClosestValue
} from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';
import { action } from '../macros/action';

/**
 * Clicks elements matched by a selector.
 *
 * @example
 *
 * // <button class="continue">Continue<button>
 * // <button>Cancel</button>
 *
 * import { create, clickable } from 'ember-cli-page-object';
 *
 * const page = create({
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
 * import { create, clickable } from 'ember-cli-page-object';
 *
 * const page = create({
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
 * import { create, clickable } from 'ember-cli-page-object';
 *
 * const page = create({
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
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */
export function clickable(selector, userOptions = {}) {
  return action((node, options) => {
    options = assign(options, userOptions);

    let context = getExecutionContext(node);
    let fullSelector = buildSelector(node, selector, options);
    let container = options.testContainer || findClosestValue(node, 'testContainer');

    context.assertElementExists(fullSelector, options);

    return context.click(fullSelector, container, options);
  });
}
