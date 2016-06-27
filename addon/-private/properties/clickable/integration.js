import Ember from 'ember';
import {
  simpleFindElementWithAssert,
  buildSelector
} from '../../../helpers';

const { run, $ } = Ember;

export default function integrationClick(pageObjectNode, selector, options, context) {
  run(function() {
    let fullSelector = buildSelector(pageObjectNode, selector, options);

    // Run this to validate if the element exists and it is visible
    simpleFindElementWithAssert(pageObjectNode, fullSelector, options);

    if (options.testContainer) {
      $(fullSelector, options.testContainer).click();
    } else {
      context.$(fullSelector).click();
    }
  });
}
