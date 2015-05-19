import Ember from 'ember';

export function qualifySelector(...selectors) {
  return selectors.filter(item => !!item).join(' ');
}

export function trim(text) {
  return Ember.$.trim(text);
}

export function isNullOrUndefined(object) {
  return object === undefined || object === null;
}
