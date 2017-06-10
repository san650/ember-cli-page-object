import { throwBetterError } from '../better-errors';

const NOT_A_FUNCTION_ERROR = 'Argument passed to `descriptor` must be a function.';

/**
 * Creates a descriptor whose value is determined by the passed-in function.
 * The passed-in function must not be bound and must not be an arrow function,
 * as this will prevent the function from being called with the correct context.
 *
 * @example
 *
 * // <input type="text">
 * // <button>Submit</button>
 *
 * import { create } from 'ember-cli-page-object';
 * import { descriptor } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   inputValue: value('input'),
 *   isSubmitButtonDisabled: property('disabled', 'button'),
 *
 *   // with the `descriptor` macro
 *   isFormEmpty: descriptor(function() {
 *     return !this.inputValue && this.isSubmitButtonDisabled;
 *   }),
 *
 *   // without the `descriptor` macro
 *   _isFormEmpty: {
 *     isDescriptor: true,
 *     get() {
 *       return !this.inputValue && this.isSubmitButtonDisabled;
 *     }
 *   }
 * });
 *
 * // checks the value returned by the function passed into `descriptor`
 * assert.ok(page.isFormEmpty);
 *
 * @public
 *
 * @param {Function} getter - function that determines the value of this descriptor
 * @return {Descriptor}
 *
 * @throws Will throw an error if a function is not passed in as the first argument
 */
export function descriptor(getter) {
  return {
    isDescriptor: true,

    get(key) {
      if (typeof getter !== 'function') {
        throwBetterError(this, key, NOT_A_FUNCTION_ERROR);
      }

      return getter.call(this, key);
    }
  };
}
