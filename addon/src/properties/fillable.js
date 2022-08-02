import { findMany } from '../-private/finders';
import action from '../-private/action';
import { findOne } from '../-private/finders';
import { getAdapter } from '../adapters/index';

/**
 * Alias for `fillable`, which works for inputs, HTML select menus, and
 * contenteditable elements.
 *
 * [See `fillable` for usage examples.](#fillable)
 *
 * @name selectable
 * @function
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */

/**
 * Fills in an input matched by a selector.
 *
 * @example
 *
 * // <input value="">
 *
 * import { create, fillable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   fillIn: fillable('input')
 * });
 *
 * // result: <input value="John Doe">
 * page.fillIn('John Doe');
 *
 * @example
 *
 * // <div class="name">
 * //   <input value="">
 * // </div>
 * // <div class="last-name">
 * //   <input value= "">
 * // </div>
 *
 * import { create, fillable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   fillInName: fillable('input', { scope: '.name' })
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @example
 *
 * // <div class="name">
 * //   <input value="">
 * // </div>
 * // <div class="last-name">
 * //   <input value= "">
 * // </div>
 *
 * import { create, fillable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: 'name',
 *   fillInName: fillable('input')
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @example <caption>Filling different inputs with the same property</caption>
 *
 * // <input id="name">
 * // <input name="lastname">
 * // <input data-test="email">
 * // <textarea aria-label="address"></textarea>
 * // <input placeholder="phone">
 * // <div contenteditable="true" id="bio"></div>
 *
 * const page = create({
 *   fillIn: fillable('input, textarea, [contenteditable]')
 * });
 *
 * page
 *   .fillIn('name', 'Doe')
 *   .fillIn('lastname', 'Doe')
 *   .fillIn('email', 'john@doe')
 *   .fillIn('address', 'A street')
 *   .fillIn('phone', '555-000')
 *   .fillIn('bio', 'The story of <b>John Doe</b>');
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 */
export function fillable(selector = '', userOptions = {}) {
  return action(
    { ...userOptions, selector },
    function (contentOrClue, content) {
      let clue;
      if (content === undefined) {
        content = contentOrClue;
      } else {
        clue = contentOrClue;
      }

      let scopeSelector = selector;
      if (clue) {
        scopeSelector = findSelectorByClue(this, selector, userOptions, clue);
        if (!scopeSelector) {
          throw new Error(`Can not find element by clue: "${clue}".`);
        }
      }

      const element = findOne(this, scopeSelector, userOptions);

      return getAdapter().fillIn(element, content);
    }
  );
}

function findSelectorByClue(node, selector, findOptions, clue) {
  let cssClues = ['input', 'textarea', 'select', '[contenteditable]']
    .map((tag) => [
      `${tag}[data-test="${clue}"]`,
      `${tag}[aria-label="${clue}"]`,
      `${tag}[placeholder="${clue}"]`,
      `${tag}[name="${clue}"]`,
      `${tag}#${clue}`,
    ])
    .reduce((total, other) => total.concat(other), []);

  return cssClues.find((extraScope) => {
    return findMany(node, `${selector} ${extraScope}`, findOptions)[0];
  });
}
