import { buildSelector, getContext } from '../helpers';

/**
 * Creates an action to click an element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     submit: clickable('button[type=submit]')
 *   });
 *
 *   page.submit();
 *
 * @param {string} selector - CSS selector of the element to click
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function clickable(selector, options = {}) {
  return {
    isDescriptor: true,

    value() {
      const fullSelector = buildSelector(this, selector, options);
      const context = getContext(this);

      if (context) {
        Ember.run(() => {
          context.$(fullSelector).click();
        });
      } else {
        /* global click */
        click(fullSelector);
      }

      return this;
    }
  };
}
