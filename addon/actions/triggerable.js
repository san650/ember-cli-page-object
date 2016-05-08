import Ember from 'ember';
import { simpleFindElementWithAssert, buildSelector, getContext } from '../helpers';

function triggerableInternal(tree, eventType, selector, options, context) {
  var eventOptions = options.eventProperties,
    fullSelector = buildSelector(tree, selector, options);

  delete options.eventProperties;

  // Run this to validate if the element exists
  simpleFindElementWithAssert(tree, fullSelector, options)

  if (context) {
    let event = Ember.$.Event(eventType, eventOptions);

    if (options.testContainer) {
      Ember.$(fullSelector, options.testContainer).trigger(event);
    } else {
      context.$(fullSelector).trigger(event);
    }
  } else {
    /* global triggerEvent */
    triggerEvent(fullSelector, options.testContainer, eventType, eventOptions);
  }
}

/**
 *
 * Triggers event on element matched by selector.
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * const page = PageObject.create({
 *   focus: triggerable('focus', '.name')
 * });
 *
 * // focuses on element with selector '.name'
 * page.focus();
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * const page = PageObject.create({
 *   enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
 * });
 *
 * // triggers keypress using enter key on element with selector '.name'
 * page.enter();
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * const page = PageObject.create({
 *   focus: triggerable('focus', '.name', { scope: '.scope' })
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
 * const page = PageObject.create({
 *   scope: '.scope',
 *   focus: triggerable('focus', '.name')
 * });
 *
 * // clicks on element with selector '.scope button.continue'
 * page.focus();
 *
 * @public
 *
 * @param {string} event - Event to be triggered
 * @param {string} selector - CSS selector of the element on which the event will be triggered
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {String} options.testContainer - Context where to search elements in the DOM
 * @param {String} options.eventProperties - Event properties that will be passed to trigger function
 * @return {Descriptor}
*/
export function triggerable(event, selector, options = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function() {
        const context = getContext(this);

        if (context) {
          run(() => triggerableInternal(this, event, selector, { ...options, pageObjectKey: `${key}()` }, context));
        } else {
          wait().then(() => triggerableInternal(this, event, selector, { ...options, pageObjectKey: `${key}()` }));
        }

        return this;
      };
    }
  };
}
