import { buildSelector, getContext } from '../helpers';

const { assert, run } = Ember;

function fillForAcceptance(tree, selector, textToUse, options) {
  /* global fillIn */
  fillIn(buildSelector(tree, selector, options), textToUse);
}

function fillForIntegration(tree, selector, textToUse, options) {
  const context = getContext(tree);

  // FIXME: improve message and test this case
  assert('You need to set `context` in component integration tests', context);

  const $el = context.$(buildSelector(tree, selector, options));

  run(function() {
    $el.val(textToUse);
    $el.trigger('input');
    $el.change();
  });
}

/**
 * Fills in an input matched by a selector.
 *
 * @example
 *
 * // <input value="">
 *
 * const page = PageObject.create({
 *   fillIn: PageObject.fillable('input')
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
 * const page = PageObject.create({
 *   fillInName: PageObject.fillable('input', { scope: '.name' })
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
 * const page = PageObject.create({
 *   scope: 'name',
 *   fillInName: PageObject.fillable('input')
 * });
 *
 * page.fillInName('John Doe');
 *
 * // result
 * // <div class="name">
 * //   <input value="John Doe">
 * // </div>
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to look for text
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Override parent's scope
 * @return {Descriptor}
 */
export function fillable(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToUse) {
      if (typeof(fillIn) === 'function') {
        fillForAcceptance(this, selector, textToUse, options);
      } else {
        fillForIntegration(this, selector, textToUse, options);
      }

      return this;
    }
  }
}
