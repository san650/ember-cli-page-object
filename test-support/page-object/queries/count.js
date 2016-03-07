import Ember from 'ember';
import { findElement } from '../helpers';

var $ = Ember.$;

/**
 * Gets the count of matched elements
 *
 * @example
 *
 *   var page = PageObject.create({
 *     imageCount: count('.img')
 *   });
 *
 *   assert.equal(page.imageCount(), 2);
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Add scope
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */
export function count(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let countOptions = {};

      $.extend(true, countOptions, options, { multiple: true });

      return findElement(this, selector, countOptions).length;
    }
  };
}
