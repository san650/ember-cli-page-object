import Ember from 'ember';
import { simpleFindElementWithAssert, buildSelector, getContext } from '../helpers';

function focusableInternal(tree, selector, options, context) {
  var fullSelector = buildSelector(tree, selector, options);

  // Run this to validate if the element exists
  simpleFindElementWithAssert(tree, fullSelector, options)

  if (context) {
    if (options.testContainer) {
      Ember.$(fullSelector, options.testContainer).focus();
    } else {
      context.$(fullSelector).focus();
    }
  } else {
    /* global triggerEvent */
    triggerEvent(fullSelector, options.testContainer, "focus");
  }
}

/**
 *
 * Focus on element matched by selector.
 *
 * @example
 *
 * // <input class="name">
 * // <input class="email">
 *
 * const page = PageObject.create({
 *   focusOnName: focusable('.name')
 * });
 *
 * // focuses on element with selector '.name'
 * page.focusOnName();
 *
 * @example
 *
 * // <div class="scope">
 * //   <input class="name">
 * // </div>
 * // <input class="email">
 *
 * const page = PageObject.create({
 *   focusOnName: focusable('.name', { scope: '.scope' })
 * });
 *
 * // focuses on element with selector '.scope .name'
 * page.focusOnName();
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
 *   continue: focusable('.name')
 * });
 *
 * // clicks on element with selector '.scope button.continue'
 * page.focusOnName();
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to focus on
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
*/
export function focusable(selector, options = {}) {
  return {
    isDescriptor: true,

    get(key) {
      return function() {
        const context = getContext(this);

        if (context) {
          run(() => focusableInternal(this, selector, { ...options, pageObjectKey: `${key}()` }, context));
        } else {
          wait().then(() => focusableInternal(this, selector, { ...options, pageObjectKey: `${key}()` }));
        }

        return this;
      };
    }
  };
}
