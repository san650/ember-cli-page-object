import { simpleFindElementWithAssert } from '../../../helpers';
import { buildSelector } from './helpers';

/* global wait, click */

export default function acceptanceClick(pageObjectNode, selector, options) {
  wait().then(function() {
    let fullSelector = buildSelector(pageObjectNode, selector, options);

    // Run this to validate if the element exists
    simpleFindElementWithAssert(pageObjectNode, fullSelector, options);

    click(fullSelector, options.testContainer);
  });
}
