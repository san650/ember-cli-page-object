import { throwBetterError } from '../better-errors';
import {
  getProperty,
  objectHasProperty
} from '../helpers';

const NEEDS_CALLBACK = '`test` expects a function to be passed in as its second argument.';
const TESTED_PROP_NOT_FOUND = 'PageObject does not contain property';

/**
 * Creates a node whose value is returned as `true` or `false` depending on
 * whether the target PageObject property satisfies the test specified by
 * the provided callback function.
 *
 * An arrow function can be passed in as the test function, but only if it
 * does not expect to access other PageObject properties on `this`. If some
 * reference is needed to other PageObject properties, a standard function
 * should be passed in as the callback.
 *
 * @example
 *
 * // <input type="text" autocomplete="on">
 *
 * import { create } from 'ember-cli-page-object';
 * import { test } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   inputAutocomplete: property('autocomplete', 'input'),
 *   isAutocompleteEnabled: test('inputAutocomplete', function(val) {
 *     return val === 'on';
 *   })
 * });
 *
 * // checks whether the top-level property `inputAutocomplete`
 * // passes the test `val === 'on'`.
 * assert.ok(page.isAutocompleteEnabled);
 *
 * @example
 *
 * // <input type="text" autocomplete="on">
 *
 * import { create } from 'ember-cli-page-object';
 * import { test } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   form: {
 *     inputAutocomplete: property('autocomplete', 'input'),
 *   },
 *   isAutocompleteEnabled: test('form.inputAutocomplete', function(val) {
 *     return val === 'on';
 *   })
 * });
 *
 * // checks whether the nested property `form.inputAutocomplete`
 * // passes the test `val === 'on'`.
 * assert.ok(page.isAutocompleteEnabled);
 *
 * @example
 *
 * // <input type="text" autocomplete="on">
 *
 * import { create } from 'ember-cli-page-object';
 * import { test } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   inputAutocomplete: property('autocomplete', 'input'),
 *   isAutocompleteEnabled: test('inputAutocomplete', val => val === 'on')
 * });
 *
 * // uses an arrow function to check whether `inputAutocomplete`
 * // passes the test `val === 'on'`.
 * assert.ok(page.isAutocompleteEnabled);
 *
 * @example
 *
 * // <div>
 * //   <span>Enter Your Name Here:</span>
 * //   {{input value=name}}
 * // </div>
 * // <div class="greeting">Hello, {{name}}</div>
 *
 * import { create } from 'ember-cli-page-object';
 * import { test } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   nameInputValue: value('input'),
 *   greetingText: text('.greeting'),
 *   greetingTextIncludesName: test('greetingText', function(val) {
 *     return val === 'Hello, ' + this.nameInputValue;
 *   })
 * });
 *
 * // uses a standard function to determine whether `page.greetingText`
 * // passes the test `val === 'Hello, ' + this.nameInputValue`.
 * assert.ok(page.greetingTextIncludesName);
 *
 * @public
 *
 * @param {string} pathToProp - dot-separated path to a property specified on the PageObject
 * @param {Function} callback - function used to test the value of the target PageObject property
 * @return {Descriptor}
 *
 * @throws Will throw an error if the PageObject does not have the property to test.
 * @throws Will throw an error if a function is not passed in as the second argument.
 */
export function test(pathToProp, callback) {
  return {
    isDescriptor: true,

    get(key) {
      if (typeof callback !== 'function') {
        throwBetterError(this, key, NEEDS_CALLBACK);
      }

      if (!objectHasProperty(this, pathToProp)) {
        throwBetterError(this, key, `${TESTED_PROP_NOT_FOUND} \`${pathToProp}\`.`);
      }

      const value = getProperty(this, pathToProp);
      return Boolean(callback.call(this, value));
    }
  };
}
