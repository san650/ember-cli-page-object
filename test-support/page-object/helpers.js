import Ember from 'ember';

export function qualifySelector(...selectors) {
  return selectors.filter(item => !!item).join(' ');
}

/**
 * Trim whitespaces at both ends and normalize whitespaces inside `text`
 *
 * Due to variations in the HTML parsers in different browsers, the text
 * returned may vary in newlines and other white space.
 *
 * @see http://api.jquery.com/text/
 */
export function trim(text) {
  return Ember.$.trim(text).replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
}

export function isNullOrUndefined(object) {
  return object === undefined || object === null;
}

export function indexedSelector(baseSelector, index) {
  let selector;

  if ($.isNumeric(index) && index > 0) {
    selector = `${baseSelector}:eq(${index - 1})`;
  } else {
    selector = baseSelector;
  }

  return selector;
}
