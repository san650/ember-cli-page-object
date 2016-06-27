import {
  buildSelector,
  simpleFindElementWithAssert
} from '../../../helpers';

/* global wait */
/* global click */

export default function acceptanceClick(pageObjectNode, selector, options) {
  wait().then(() => {
    let fullSelector = buildSelector(pageObjectNode, selector, options);

    // Run this to validate if the element exists and it is visible
    simpleFindElementWithAssert(pageObjectNode, fullSelector, options);

    click(fullSelector, options.testContainer);
  });
}
