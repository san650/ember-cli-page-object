import $ from '-jquery';

/**
 * @private
 *
 * Fills inputs, textareas, or contenteditable elements with the passed-in content.
 *
 * @param {jQuery} $selection              jQuery object containing collection of DOM elements to fill in
 * @param {string} content                 Content to be inserted into the target element(s)
 * @param {Object} options                 Options for error reporting
 * @param {string} options.selector        jQuery selector used to target element(s) to fill in
 * @param {Ceibo} options.pageObjectNode   PageObject node containing the method which, when invoked, resulted in this call to `fillElement`
 * @param {string} options.pageObjectKey   Key of method on PageObject which, when invoked, resulted in this call to `fillElement`
 * @return
 *
 * @throws Will throw an error if called on a contenteditable element that has `contenteditable="false"`
 */
export function fillElement(selection, content) {
  const $selection = $(selection);

  if ($selection.is('[contenteditable][contenteditable!="false"]')) {
    $selection.html(content);
  } else if ($selection.is('[contenteditable="false"]')) {
    throw new Error('Element cannot be filled because it has `contenteditable="false"`.');
  } else {
    $selection.val(content);
  }
}

/**
 * @private
 *
 * Given an element, asserts that element is focusable/blurable
 *
 * @param {Element} element - the element to check
 */
export function assertFocusable(element) {
  let $element = $(element);

  let error;

  if ($element.is(':hidden')) {
    error = 'hidden';
  } else if ($element.is(':disabled')) {
    error = 'disabled';
  } else if ($element.is('[contenteditable="false"]')) {
    error = 'contenteditable="false"';
  } else if (!$element.is(':input, a[href], area[href], iframe, [contenteditable], [tabindex]')) {
    error = 'not a link, input, form element, contenteditable, iframe, or an element with tabindex';
  }

  if (error) {
    throw new Error(`Element is not focusable because it is ${error}`);
  }
}
