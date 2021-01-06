import { assign } from '../-private/helpers';
import { findOne } from '../extend';
import $ from '-jquery';

function identity(v) {
  return v;
}

/**
 * @public
 *
 * Returns text of the element or Array of texts of all matched elements by selector.
 *
 * @example
 *
 * // Hello <span>world!</span>
 *
 * import { create, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   text: text('span')
 * });
 *
 * assert.equal(page.text, 'world!');
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * import { create, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   text: text('span', { scope: '.scope' })
 * });
 *
 * assert.equal(page.text, 'ipsum');
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope"><span>ipsum</span></div>
 * // <div><span>dolor</span></div>
 *
 * import { create, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   text: text('span')
 * });
 *
 * // returns 'ipsum'
 * assert.equal(page.text, 'ipsum');
 *
 * @example
 *
 * // <div><span>lorem</span></div>
 * // <div class="scope">
 * //  ipsum
 * // </div>
 * // <div><span>dolor</span></div>
 *
 * import { create, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: '.scope',
 *   text: text('span', { normalize: false })
 * });
 *
 * // returns 'ipsum'
 * assert.equal(page.text, '\n ipsum\n');
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {boolean} options.normalize - Set to `false` to avoid text normalization
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function text(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let options = assign({ pageObjectKey: key }, userOptions);
      let f = options.normalize === false ? identity : normalizeText;

      return f($(findOne(this, selector, options)).text());
    }
  };
}

/**
 * @private
 *
 * Trim whitespaces at both ends and normalize whitespaces inside `text`
 *
 * Due to variations in the HTML parsers in different browsers, the text
 * returned may vary in newlines and other white space.
 *
 * @see http://api.jquery.com/text/
 */
function normalizeText(text) {
  return text.trim().replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
}
