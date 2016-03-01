import { buildSelector, getContext } from '../helpers';

const { assert, run } = Ember;

function clickForAcceptance(tree, selector, options) {
  /* global click */
  click(buildSelector(tree, selector, options));
}

function clickForIntegration(tree, selector, options) {
  const context = getContext(tree);

  // FIXME: improve message and test this case
  assert('You need to set `context` in component integration tests', context);

  run(function() {
    context.$(buildSelector(tree, selector, options)).click();
  });
}

/**
 * Clicks elements matched by a selector.
 *
 * @example
 *
 * // <button class="continue">Continue<button>
 * // <button>Cancel</button>
 *
 * const page = PageObject.create({
 *   continue: clickable('button.continue')
 * });
 *
 * // clicks on element with selector 'button.continue'
 * page.continue();
 *
 * @example
 *
 * // <div class="scope">
 * //   <button>Continue<button>
 * // </div>
 * // <button>Cancel</button>
 *
 * const page = PageObject.create({
 *   continue: clickable('button.continue', { scope: '.scope' })
 * });
 *
 * // clicks on element with selector '.scope button.continue'
 * page.continue();
 *
 * @example
 *
 * // <div class="scope">
 * //   <button>Continue<button>
 * // </div>
 * // <button>Cancel</button>
 *
 * const page = PageObject.create({
 *   scope: '.scope',
 *   continue: clickable('button.continue')
 * });
 *
 * // clicks on element with selector '.scope button.continue'
 * page.continue();
 *
 * @public
 *
 * @param {string} selector - CSS selector of the element to click
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {boolean} options.resetScope - Ignore parent scope
 * @return {Descriptor}
 */

export function clickable(selector, options = {}) {
  return {
    isDescriptor: true,

    value() {
      if (typeof(click) === 'function') {
        clickForAcceptance(this, selector, options);
      } else {
        clickForIntegration(this, selector, options);
      }

      return this;
    }
  };
}
