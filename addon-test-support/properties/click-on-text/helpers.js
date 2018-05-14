import {
  assign,
  buildSelector as originalBuildSelector
} from '../../-private/helpers';

function childSelector(pageObjectNode, context, selector, options) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  let selectorWithSpace = `${selector || ''} `;
  let opts = assign({ last: true, multiple: true }, options);

  if (context.find(selectorWithSpace, opts).length) {
    return originalBuildSelector(pageObjectNode, selectorWithSpace, opts);
  }
}

export function buildSelector(pageObjectNode, context, selector, options) {
  let childSel = childSelector(pageObjectNode, context, selector, options);

  if (childSel) {
    return childSel;
  } else {
    return originalBuildSelector(pageObjectNode, selector, options);
  }
}
