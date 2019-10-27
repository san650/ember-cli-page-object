import { findElement, action as _action } from 'ember-cli-page-object/extend';
import run from '../-private/run';
import { assign, buildSelector } from '../-private/helpers';
import { throwBetterError, ELEMENT_NOT_FOUND } from '../-private/better-errors';

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
  return new Action(function(key, contentOrClue, content) {
    return run(this, ({ fillIn }) => {
      let options = assign({ pageObjectKey: `${key}()` }, userOptions);

      let clue;
      if (content === undefined) {
        content = contentOrClue;
      } else {
        clue = contentOrClue;
      }

      let scopeSelector = clue
        ? `${selector} ${getClueSelector(this, selector, options, clue)}`
        : selector;

      return _action(this, scopeSelector, options,
        (element) => fillIn(element, content)
      );
    });
  })
}

class Action {
  constructor(fn) {
    this.isDescriptor = true;

    this.get = function(key) {
      return function() {
        return fn.bind(this)(key, ...arguments);
      }
    };
  }
}


function getClueSelector(pageObject, selector, options, clue) {
  let cssClues = ['input', 'textarea', 'select', '[contenteditable]'].map((tag) => [
    `${tag}[data-test="${clue}"]`,
    `${tag}[aria-label="${clue}"]`,
    `${tag}[placeholder="${clue}"]`,
    `${tag}[name="${clue}"]`,
    `${tag}#${clue}`
  ])
  .reduce((total, other) => total.concat(other), [])

  const clueScope = cssClues.find(extraScope => {
    return findElement(pageObject, `${selector} ${extraScope}`, options).get(0);
  });

  if (!clueScope) {
    const pageObjectSelector = buildSelector(pageObject, '', options);
    const possibleSelectors = cssClues.map((cssClue) => {
      const childSelector = `${selector} ${cssClue}`.trim();

      return `${pageObjectSelector} ${childSelector}`;
    });

    throwBetterError(pageObject, options.pageObjectKey, ELEMENT_NOT_FOUND, {
      selector: possibleSelectors.join(',')
    })
  }

  return clueScope;
}