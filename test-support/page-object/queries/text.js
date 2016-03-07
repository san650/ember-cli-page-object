import Ember from 'ember';
import { findElementWithAssert, normalizeText } from '../helpers';

var $ = Ember.$;

/**
 * Gets the text of the matched element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     title: text('h1')
 *   });
 *
 *   assert.equal(page.title, 'Page title');
 *
 *   var page = PageObject.create({
 *     options: text('li', { multiple: true })
 *   });
 *
 *   assert.deepEqual(page.options, ['lorem', 'ipsum'])
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @param {boolean} options.multiple - Return an array of values
 * @return {Descriptor}
 */
export function text(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      var element = findElementWithAssert(this, selector, options),
          result;

      if (options.multiple) {
        result = $.map(element, e => normalizeText($(e).text()));
      } else {
        result = normalizeText(element.text());
      }

      return result;
    }
  };
}
