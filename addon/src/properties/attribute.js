import { findOne } from '../-private/finders';
import { getter } from '../macros/index';

/**
 * @public
 *
 * Returns the value of an attribute from the matched element
 *
 * @example
 * // <input placeholder="a value">
 *
 * import { create, attribute } from 'ember-cli-page-object';
 *
 * const page = create({
 *   inputPlaceholder: attribute('placeholder', 'input')
 * });
 *
 * assert.equal(page.inputPlaceholder, 'a value');
 *
 * @example
 *
 * // <div><input></div>
 * // <div class="scope"><input placeholder="a value"></div>
 * // <div><input></div>
 *
 * import { create, attribute } from 'ember-cli-page-object';
 *
 * const page = create({
 *   inputPlaceholder: attribute('placeholder', ':input', { scope: '.scope' })
 * });
 *
 * assert.equal(page.inputPlaceholder, 'a value');
 *
 * @example
 *
 * // <div><input></div>
 * // <div class="scope"><input placeholder="a value"></div>
 * // <div><input></div>
 *
 * import { create, attribute } from 'ember-cli-page-object';
 *
 * const page = create({
 *   scope: 'scope',
 *   inputPlaceholder: attribute('placeholder', ':input')
 * });
 *
 * assert.equal(page.inputPlaceholder, 'a value');
 *
 * @public
 *
 * @param {string} attributeName - Name of the attribute to get
 * @param {string} selector - CSS selector of the element to check
 * @param {Object} options - Additional options
 * @param {string} options.scope - Nests provided scope within parent's scope
 * @param {boolean} options.resetScope - Override parent's scope
 * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
 * @param {string} options.testContainer - Context where to search elements in the DOM
 * @return {Descriptor}
 *
 * @throws Will throw an error if no element matches selector
 * @throws Will throw an error if multiple elements are matched by selector
 */
export function attribute(attributeName, selector, userOptions = {}) {
  return getter(function (key) {
    const element = findOne(this, selector, {
      pageObjectKey: key,
      ...userOptions,
    });

    return attr(element, attributeName);
  });
}

const BOOL_ATTRS = [
  'checked',
  'selected',
  'async',
  'autofocus',
  'autoplay',
  'controls',
  'defer',
  'disabled',
  'hidden',
  'ismap',
  'loop',
  'multiple',
  'open',
  'readonly',
  'required',
  'scoped',
];

/**
 * Get `Element` attribute value
 *
 * For backward compatibility reasons we aim to follow the way the `$.attr(` works
 * @see: https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/attributes/attr.js
 *
 * @param {Element} element
 * @param {string} attributeName
 * @returns string|undefined
 */
function attr(element, attributeName) {
  const value = element.getAttribute(attributeName);
  if (value) {
    // Non-existent attributes return `null`, we normalize to undefined
    return value == null ? undefined : value;
  }

  const attributeNode = element.getAttributeNode(attributeName);
  if (attributeNode) {
    const { specified, value } = attributeNode;

    if (specified && value !== null) {
      const lcAttributeName = attributeName.toLowerCase();
      return BOOL_ATTRS.includes(lcAttributeName) ? lcAttributeName : value;
    }
  }

  return undefined;
}
