import Ember from 'ember';
import { buildSelector, getContext } from '../helpers';

/**
 * Creates an action to fill in an input
 *
 * @example
 *
 *   var page = PageObject.create({
 *     name: fillable('#name')
 *   });
 *
 *   page.name('John Doe');
 *
 * @param {string} selector - CSS selector of the element to fill
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function fillable(selector, options = {}) {
  return {
    isDescriptor: true,

    value(text) {
      const fullSelector = buildSelector(this, selector, options);
      const context = getContext(this);

      if (context) {
        const $el = context.$(fullSelector);

        Ember.run(() => {
          $el.val(text);
          $el.trigger('input');
          $el.change();
        });
      } else {
        /* global fillIn */
        fillIn(fullSelector, text);
      }

      return this;
    }
  }
}
