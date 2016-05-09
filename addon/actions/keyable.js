import Ember from 'ember';
import { simpleFindElementWithAssert, buildSelector, getContext } from '../helpers';

function keyableInternal(tree, eventType, keyCode, selector, options, context) {
  var eventOptions = options.eventProperties,
    fullSelector = buildSelector(tree, selector, options);

  delete options.eventProperties;

  // Run this to validate if the element exists
  simpleFindElementWithAssert(tree, fullSelector, options)

  if (context) {
    let event = Ember.$.Event(eventType, { keyCode });

    if (options.testContainer) {
      Ember.$(fullSelector, options.testContainer).trigger(event);
    } else {
      context.$(fullSelector).trigger(event);
    }
  } else {
    /* global keyEvent */
    keyEvent(fullSelector, options.testContainer, eventType, keyCode);
  }
}

/**
 *
 * Triggers key event with specified key code on element matched by selector.
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * const page = PageObject.create({
 *   enter: keyable('keypress', 13, '.name', { scope: '.name' })
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
 *   enter: keyable('keypress', 13, '.name', { scope: '.scope' })
 * });
 *
 * // triggers keypress using enter key on element with selector '.scope .name'
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
 *   scope: '.scope',
 *   enter: triggerable('keypress', 13, '.name')
 * });
 *
 * // triggers keypress using enter key on element with selector '.scope button.continue'
 * page.enter();
 *
 * @public
 *
 * @param {string} event - Key event to be triggered
 * @param {string} keyCode - Key code that will be passed when triggering event
 * @param {string} selector - CSS selector of the element on which the event will be triggered
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {String} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
*/
export function keyable(event, keyCode, selector, options = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function() {
        const context = getContext(this);

        if (context) {
          run(() => keyableInternal(this, event, keyCode, selector, { ...options, pageObjectKey: `${key}()` }, context));
        } else {
          wait().then(() => keyableInternal(this, event, keyCode, selector, { ...options, pageObjectKey: `${key}()` }));
        }

        return this;
      };
    }
  };
}
