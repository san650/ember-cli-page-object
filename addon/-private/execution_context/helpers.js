import {
  throwBetterError
} from '../better-errors';

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
export function fillElement(selection, content, { selector, pageObjectNode, pageObjectKey }) {
  const $selection = $(selection);

  if ($selection.is('[contenteditable][contenteditable!="false"]')) {
    $selection.html(content);
  } else if ($selection.is('[contenteditable="false"]')) {
    throwBetterError(
      pageObjectNode,
      pageObjectKey,
      'Element cannot be filled because it has `contenteditable="false"`.',
      { selector }
    );
  } else {
    $selection.val(content);
  }
}
