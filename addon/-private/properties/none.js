import Ember from 'ember';

import {
  getProperty,
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

function _isFalsy(node, key) {
  let value = getProperty(node, key);

  while (typeof value === 'function') {
    value = value();
  }

  if (value && value.toArray) {
    value = value.toArray();
  }

  const values = Array.isArray(value) ? value : [value];
  const propsWithCustomFalsyValues = node._propsWithCustomFalsyValues || {};

  if (propsWithCustomFalsyValues[key]) {
    const falsyValues = propsWithCustomFalsyValues[key].falsyValues;
    return values.every((val) => {
      return !val || Ember.isEmpty(val) || falsyValues.indexOf(val) !== -1;
    });
  }

  return values.every((val) => {
    return !val || Ember.isEmpty(val);
  });
}
