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

        return function (...args) {
          // We can't just return value(...args) here because if the alias points
          // to a property on a child node, then the return value would be that
          // child node rather than this node.
          value(...args);

          return chainable(this);
        };
      } catch (e) {
        throwBetterError(this, key, e);
      }
    },
  };
}

/**
 * @private
 *
 * Returns the value of an object property. If the property is a function,
 * the return value is that function bound to its "owner."
 *
 * @param {Object} object - object on which to look up the target property
 * @param {string} pathToProp - dot-separated path to property
 * @return {Boolean|String|Number|Function|Null|Undefined} - value of property
 */
function getProperty(object, pathToProp) {
  const pathSegments = pathToProp.split('.');

  let parent = object;
  let value;
  while (pathSegments.length > 0) {
    const key = pathSegments.shift();

    if (
      parent === null ||
      typeof parent !== 'object' ||
      !Object.prototype.hasOwnProperty.call(parent, key)
    ) {
      throw new Error(`${ALIASED_PROP_NOT_FOUND} \`${pathToProp}\`.`);
    }

    if (pathSegments.length) {
      parent = parent[key];
    } else {
      value = parent[key];
    }
  }

  return typeof value === 'function' ? value.bind(parent) : value;
}
