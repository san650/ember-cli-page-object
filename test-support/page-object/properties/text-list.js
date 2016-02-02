import Ember from 'ember';
import Descriptor from '../descriptor';
import { findElementWithAssert, trim } from '../helpers';

/**
 * Gets an array whose members are matched elements' text
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {string} options.selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @return {array} array of text strings for the selected elements
 */
function getTextList(target, key, options) {
  let elements = findElementWithAssert(options, target);

  let textStrings = new Array(elements.length);
  for (var i=0, l=textStrings.length; i<l; i++) {
    textStrings[i] = trim(Ember.$(elements[i]).text());
  }
  return textStrings;
}

/**
 * Creates a predicate to get the text of each matched elements as an array element
 *
 * @example
 *
 *   var page = PageObject.create({
 *     movieTitles: textList('ul.movies li')
 *   });
 *
 *   assert.equal(page.movieTitles(), ['Ran', 'Apocalyse Now','Star Wars']);
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Overrides parent scope
 * @return {Descriptor}
 */
export default function textList(selector, options = {}) {
  options.selector = selector;
  options.multiple = true;

  return new Descriptor(getTextList, options);
}
