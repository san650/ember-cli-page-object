import Ember from 'ember';
import PageObject from '../page-object';

export function qualifySelector(...selectors) {
  return selectors.filter(item => !!item).join(' ');
}

export function findElementWithAssert(options, target) {
  let selector = qualifySelector(
    options.scope || target.scope,
    indexedSelector(options.selector, options.index)
  );

  let elementToAssert = findWithAssert(selector),
      allowMultiple = options['multiple'];

  if (typeof(allowMultiple) === 'undefined') {
    allowMultiple = PageObject.matchMultipleElements;
  }

  if (!allowMultiple && elementToAssert.length > 1) {
    throw new Error(`${selector} matched more than one element. If this is not an error use { multiple: true }`);
  }

  return elementToAssert;
}

export function findElement(options, target) {
  let selector = qualifySelector(
    options.scope || target.scope,
    indexedSelector(options.selector, options.index)
  );

  /* global find */
  return find(selector);
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

export function indexedSelector(baseSelector, index) {
  let selector;

  if ($.isNumeric(index) && index > 0) {
    selector = `${baseSelector}:eq(${index - 1})`;
  } else {
    selector = baseSelector;
  }

  return selector;
}
