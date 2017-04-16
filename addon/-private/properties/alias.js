import { getExecutionContext } from '../execution_context';
import { throwBetterError } from '../better-errors';
import {
  getProperty,
  objectHasProperty
} from '../helpers';

const ALIASED_PROP_NOT_FOUND = 'PageObject does not contain aliased property';

/**
 * Returns the value of some other property on the PageObject.
 *
 * @example
 *
 * const page = PageObject.create({
 *   submitButton: {
 *     scope: '.submit-button'
 *   }
 *   submit: alias('submitButton.click')
 * });
 *
 * // calls `page.submitButton.click`
 * page.submit();
 *
 * @example
 *
 * const page = PageObject.create({
 *   submitButton: {
 *     scope: '.submit-button'
 *   }
 *   isSubmitButtonVisible: alias('submitButton.isVisible')
 * });
 *
 * // checks value of `page.submitButton.isVisible`
 * assert.ok(page.isSubmitButtonVisible);
 *
 * @example
 *
 * const page = PageObject.create({
 *   form: {
 *     input {
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
 *
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
      if (!objectHasProperty(this, pathToProp)) {
        throwBetterError(this, key, `${ALIASED_PROP_NOT_FOUND} \`${pathToProp}\`.`);
      }

      const value = getProperty(this, pathToProp);

      if (typeof value !== 'function' || !options.chainable) {
        return value;
      }

      const executionContext = getExecutionContext(this);

      return function(...args) {
        return executionContext.runAsync(() => value(...args));
      };
    }
  };
}
