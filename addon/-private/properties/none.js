import Ember from 'ember';

import {
  getProperty,
  getPropertyInfo,
  objectHasProperty
} from '../helpers';
import {
  PROPERTY_NOT_FOUND,
  throwBetterError
} from '../better-errors';

/**
 * Returns `false` if all of the target properties pass the falsy criteria below.
 * If a property returns an array of values due to the fact that it is defined
 * with `{ multiple: true }`, all values must meet the falsy criteria.
 *
 * A property will be treated as truthy if its value is:
 *   - `true`
 *   - number !== 0
 *   - object, even if it is empty
 *   - non-empty string
 *   - non-empty collection
 *   - non-empty array, as long as some elements are treated as truthy
 *   - a function that returns any of the above
 *
 * A property will be treated as falsy if its value is:
 *    - `false`
 *    - `null`
 *    - `undefined`
 *    - 0
 *    - NAN
 *    - empty string
 *    - empty collection
 *    - empty array
 *    - non-empty array, if all elements are treated as falsy
 *    - a function that returns any of the above
 *
 * Custom falsy values can be specified for the `attribute`, `property`,
 * `text`, and `value` helpers.
 *
 * @example
 *
 * import { create } from 'ember-cli-page-object';
 * import { none } from 'ember-cli-page-object/macros';
 *
 * const page = create({
 *   rosterNames: collection({
 *     itemScope: '.roster-name'
 *   }),
 *
 *   addNameInputValue: value('input.add-name'),
 *
 *   addedNamesText: text('.added-names', { falsy: ['---'] }),
 *
 *   labelText: text('label'),
 *
 *   labelShowsNameCountDescriptor: {
 *     isDescriptor: true,
 *     get() {
 *       return /There are \d* names on this roster/.test(this.labelText);
 *     }
 *   },
 *
 *   labelShowsNameCountFunction() {
 *     return /There are \d* names on this roster/.test(this.labelText);
 *   },
 *
 *   isRosterFormBlank: none(
 *     'rosterNames',
 *     'addNameInputValue',
 *     'addedNamesText',
 *     'labelShowsNameCountDescriptor',
 *     'labelShowsNameCountFunction'
 *    )
 * });
 *
 * // <div class="roster">
 * //   <label>Enter a name in the input below:</label>
 * //   <input class="add-name">
 * //   <div class="added-names">---</div>
 * // </div>
 *
 * assert.equal(page.isRosterFormBlank, true, 'should be true because all properties are falsy');
 *
 * // <div class="roster">
 * //   <label>Enter a name in the input below:</label>
 * //   <input class="add-name">
 * //   <div class="added-names">
 * //     <div class="roster-name">Waldo Fred</div>
 * //   </div>
 * // </div>
 *
 * assert.equal(page.isRosterFormBlank, false, 'should be false because rosterNames is not empty');
 *
 * @param {string} pathsToProps - dot-separated paths to a properties specified on the PageObject
 * @return {Descriptor}
 *
 * @throws Will throw an error if the PageObject does not have the specified properties.
 */
export function none(...pathsToProps) {
  return {
    isDescriptor: true,
    get(key) {
      for (let i = 0; i < pathsToProps.length; i++) {
        const pathToProp = pathsToProps[i];

        if (!objectHasProperty(this, pathToProp)) {
          throwBetterError(this, key, `${PROPERTY_NOT_FOUND} \`${pathsToProps[i]}\`.`);
        }

        if (!_isFalsy(this, pathToProp)) {
          return false;
        }
      }

      return true;
    }
  };
}

function _isFalsy(node, pathToProp) {
  let value = getProperty(node, pathToProp);

  while (typeof value === 'function') {
    value = value();
  }

  if (value && value.toArray) {
    value = value.toArray();
  }

  const values = Array.isArray(value) ? value : [value];
  const customFalsyValues = _getCustomFalsyValues(node, pathToProp);

  return values.every(val => _isFalsyOrEmpty(val, customFalsyValues));
}

function _getCustomFalsyValues(node, pathToProp) {
  const { propOwner, propKey } = getPropertyInfo(node, pathToProp);

  if (!propOwner || !propOwner._propsWithCustomFalsyValues) {
    return;
  }

  return propOwner._propsWithCustomFalsyValues[propKey];
}

function _isFalsyOrEmpty(val, customFalsyValues = []) {
  return !val || Ember.isEmpty(val) || customFalsyValues.indexOf(val) !== -1;
}
