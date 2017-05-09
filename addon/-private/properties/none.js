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
