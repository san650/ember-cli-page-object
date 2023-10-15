/**
 * Borrowed from jquery https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/css/hiddenVisibleSelectors.js
 *
 * Elements are considered visible if they consume space in the document. Visible elements have a width or height that is greater than zero.
 *
 * Elements with visibility: hidden or opacity: 0 are considered visible, since they still consume space in the layout.
 *
 * @private
 * @param {Element} element
 * @returns boolean
 */
export function isVisible(element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

export function text(element) {
  return element.textContent;
}

export function containsText(element, searchText) {
  return text(element).indexOf(searchText) > -1;
}
