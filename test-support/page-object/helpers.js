import Ember from 'ember';

export function BetterError(propType, key, target, selector, options) {
  this.propType = propType;
  this.key = key;
  this.target = target;
  this.selector = selector;
  this.options = options;
}

BetterError.prototype = {
  elementNotFoundMessage(fullQualifiedSelector) {
    return `
    ###########################
    Element not found
    ${this.inspect()}
      => find("${fullQualifiedSelector}")`;
  },

  inspect() {
    let message = [],
        sanitizeOptions;

    sanitizeOptions = Object
      .keys(this.options)
      .map(key => ({ key, value: this.options[key] }))
      .filter(opt => typeof(opt.value) !== 'undefined')
      .map(opt => `${opt.key}: "${opt.value}"`)
      .join(', ');

    message.push(`${this.key}: ${this.propType}("${this.selector}"`);

    if (sanitizeOptions.length) {
      message.push(`, { ${sanitizeOptions} })`);
    } else {
      message.push(')');
    }

    return message.join('');
  }
};

export function qualifySelector(...selectors) {
  return selectors.filter(item => !!item).join(' ');
}

/**
 * Looks for an element in the DOM. Raises an error if not found.
 *
 * @param {Object} options - Options
 * @param {string} options.selector - CSS selector of the element to check
 * @param {string} options.scope - Overrides parent scope
 * @param {number} options.index - Reduce the set of matched elements to the one at the specified index
 * @param {Object} target - Component that owns the property
 * @return {string} value of the attribute
 */
export function findElementWithAssert(options, target, error) {
  let selector = qualifySelector(
    options.scope || target.scope,
    indexedSelector(options.selector, options.index)
  );

  let element = findElement(options, target)

  if (element.length === 0) {
    if (error) {
      throw error.elementNotFoundMessage(selector);
    } else {
      throw `Element not found. find('${selector}')`;
    }
  }

  return element;
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
