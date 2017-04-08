import Ember from 'ember';

import { getExecutionContext } from '../execution_context';
import {
  getProperty,
  objectHasProperty
} from '../helpers';

/**
 * Returns the value of some other property on the PageObject.
 *
 * @example
 *
 * const page = PageObject.create({
 *   continueButton: {
 *     scope: 'button.continue'
 *   }
 *   continue: alias('continueButton.click')
 * });
 *
 * // calls `page.continueButton.click`
 * page.continue();
 *
 * @example
 *
 * const page = PageObject.create({
 *   continueButton: {
 *     scope: 'button.continue'
 *   }
 *   continueText: alias('continueButton.text')
 * });
 *
 * // checks value of `page.continueButton.text`
 * assert.equal(page.continueText, 'Go ahead!');
 *
 * @public
 *
 * @param {string} pathToProp - dot-separated path to PageObject property
 * @return {Descriptor}
 *
 * @throws Will throw an error if the PageObject does not have the specified property.
 */
export function alias(pathToProp) {
  return {
    isDescriptor: true,

    get(key) {
      if (!objectHasProperty(this, pathToProp)) {
        throw new Ember.Error(
          `\`${key}\`:\n PageObject does not contain aliased property \`${pathToProp}\`.`
        );
      }

      const value = getProperty(this, pathToProp);

      if (typeof value !== 'function') {
        return value;
      }

      const executionContext = getExecutionContext(this);

      return function(...args) {
        return executionContext.runAsync(() => value(...args));
      };
    }
  };
}
