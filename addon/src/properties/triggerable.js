import action from '../-private/action';
import { findOne } from '../-private/finders';
import { getAdapter } from '../adapters/index';

/**
 *
 * Triggers event on element matched by selector.
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * import { create, triggerable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
 * });
 *
 * // triggers keypress using enter key on element with selector '.name'
 * await page.enter();
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * import { create, triggerable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   keydown: triggerable('keypress', '.name')
 * });
 *
 * // triggers keypress using enter key on element with selector '.name'
 * await page.keydown({ which: 13 });
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * import { create, triggerable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   keydown: triggerable('keypress', '.name', { scope: '.scope' })
 * });
 *
 * // triggers keypress using enter key on element with selector '.name'
 * await page.keydown({ which: 13 });
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * import { create, triggerable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   keydown: triggerable('keypress', '.name')
 * });
 *
 * // triggers keypress using enter key on element with selector '.name'
 * await page.keydown({ which: 13 });
 *
 * @public
 *
 * @param {string} event - Event to be triggered
 * @param {string} selector - CSS selector of the element on which the event will be triggered
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @param {string} options.eventProperties - Event properties that will be passed to trigger function
 * @return {Descriptor}
 */
export function triggerable(event, selector, userOptions = {}) {
  const { eventProperties: initialEventProperties } = userOptions;

  return action({ ...userOptions, selector }, function (eventProperties = {}) {
    const mergedEventProperties = {
      ...initialEventProperties,
      ...eventProperties,
    };

    const element = findOne(this, selector, userOptions);

    return getAdapter().triggerEvent(element, event, mergedEventProperties);
  });
}
