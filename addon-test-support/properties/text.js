import { assign, map, normalizeText } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

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
 * // <span>lorem</span>
 * // <span> ipsum </span>
 * // <span>dolor</span>
 *
 * import { create, text } from 'ember-cli-page-object';
 *
 * const page = create({
 *   texts: text('span', { multiple: true })
 * });
 *
 * assert.deepEqual(page.texts, ['lorem', 'ipsum', 'dolor']);
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
 * @param {boolean} options.multiple - Return an array of values
 * @param {boolean} options.normalize - Set to `false` to avoid text normalization
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
 */
export function text(selector, userOptions = {}) {
  return {
    isDescriptor: true,

    get(key) {
      let executionContext = getExecutionContext(this);
      let options = assign({ pageObjectKey: key }, userOptions);

      return executionContext.run((context) => {
        let elements = context.findWithAssert(selector, options);
        let f = options.normalize === false ? identity : normalizeText;

        let result = map(elements, function(element) {
          return f(element.text());
        });

        return options.multiple ? result : result[0];
      });
    }
  };
}
