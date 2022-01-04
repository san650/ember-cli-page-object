import { throwBetterError } from '../-private/better-errors';
import { chainable } from '../-private/chainable';

const ALIASED_PROP_NOT_FOUND = 'PageObject does not contain aliased property';

/**
 * Returns the value of some other property on the PageObject.
 *
 * @example
 *
 * import { create } from 'ember-cli-page-object';
 * import { alias } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   submitButton: {
 *     scope: '.submit-button'
 *   },
 *   submit: alias('submitButton.click')
 * });
 *
 * // calls `page.submitButton.click`
 * page.submit();
 *
 * @example
 *
 * import { create } from 'ember-cli-page-object';
 * import { alias } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   submitButton: {
 *     scope: '.submit-button'
 *   },
 *   isSubmitButtonVisible: alias('submitButton.isVisible')
 * });
 *
 * // checks value of `page.submitButton.isVisible`
 * assert.ok(page.isSubmitButtonVisible);
 *
 * @example
 *
 * import { create } from 'ember-cli-page-object';
 * import { alias } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   form: {
 *     input: {
 *       scope: 'input'
 *     },
 *     submitButton: {
 *       scope: '.submit-button'
 *     }
 *   },
 *   fillFormInput: alias('form.input.fillIn', { chainable: true }),
 *   submitForm: alias('form.submitButton.click', { chainable: true })
 * });
 *
 * // executes `page.form.input.fillIn` then `page.form.submitButton.click`
 * // and causes both methods to return `page` (instead of `page.form.input`
 * // and `page.form.submitButton` respectively) so that the aliased methods
 * // can be chained off `page`.
 * page
 *   .fillFormInput('foo')
 *   .submitForm();
 *
 * @public
 *
 * @param {string} pathToProp - dot-separated path to a property specified on the PageObject
 * @param {Object} options
 * @param {Boolean} options.chainable - when this is true, an aliased
 * method returns the PageObject node on which the alias is defined, rather
 * than the PageObject node on which the aliased property is defined.
 * @return {Descriptor}
 *
 * @throws Will throw an error if the PageObject does not have the specified property.
 */
export function alias(pathToProp, options = {}) {
  return {
    isDescriptor: true,

    get(key) {
      try {
        const value = getProperty(this, pathToProp);

        if (typeof value !== 'function' || !options.chainable) {
          return value;
        }

        return function(...args) {
          // We can't just return value(...args) here because if the alias points
          // to a property on a child node, then the return value would be that
          // child node rather than this node.
          value(...args);

          return chainable(this);
        };
      } catch (e) {
        throwBetterError(this, key, e);
      }
    }
  };
}

/**
 * @public
 *
 * Returns the value of an object property. If the property is a function,
 * the return value is that function bound to its "owner."
 *
 * @param {Object} object - object on which to look up the target property
 * @param {string} pathToProp - dot-separated path to property
 * @return {Boolean|String|Number|Function|Null|Undefined} - value of property
 */
export function getProperty(object, pathToProp) {
  const pathSegments = pathToProp.split('.');

  if (pathSegments.length === 1) {
    const value = get(object, pathToProp);
    return typeof value === 'function' ? value.bind(object) : value;
  }

  const pathToPropOwner = pathSegments.slice(0, -1).join('.');
  const propOwner = get(object, pathToPropOwner);

  if (propOwner === null || propOwner === undefined) {
    return undefined;
  }

  const propKey = pathSegments[pathSegments.length - 1];
  const value = get(propOwner, propKey);

  return typeof value === 'function' ? value.bind(propOwner) : value;
}

