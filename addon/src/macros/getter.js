import { PageObjectError, throwBetterError } from '../-private/better-errors';

/**
 * Creates a Descriptor whose value is determined by the passed-in function.
 * The passed-in function must not be bound and must not be an arrow function,
 * as this would prevent it from running with the correct context.
 *
 * @example
 *
 * // <input type="text">
 * // <button disabled>Submit</button>
 *
 * import { create, value, property } from 'ember-cli-page-object';
 * import { getter } from 'ember-cli-page-object/macros';
 *
 * import { getter } from 'ember-cli-page-object/macros';
 * import { findOne } from 'ember-cli-page-object';
 *
 * function isDisabled(selector) {
 *   return getter(function (pageObjectKey) {
 *     return findOne(this, selector, { pageObjectKey }).disabled;
 *   });
 * }
 *
 * const page = create({
 *   isInputDisabled: isDisabled('input'),
 * });
 *
 * // checks the value returned by the function passed into `getter`
 * assert.ok(page.isInputDisabled);
 *
 * @public
 *
 * @param {Function} fn - determines what value is returned when the Descriptor is accessed
 * @return {Descriptor}
 *
 * @throws Will throw an error if a function is not passed in as the first argument
 */
export function getter(fn) {
  if (typeof fn !== 'function') {
    throw new Error('Argument passed to `getter` must be a function.');
  }

  return {
    isDescriptor: true,

    get(pageObjectKey) {
      try {
        return fn.call(this, pageObjectKey);
      } catch (e) {
        if (e instanceof PageObjectError) {
          if (!e.label) {
            e.label = pageObjectKey;
          }

          throw e;
        }

        throwBetterError(this, pageObjectKey, e);
      }
    },
  };
}
