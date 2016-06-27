import {
  assign,
  findElement,
  buildSelector as originalBuildSelector
} from '../../../helpers';

function childSelector(pageObjectNode, selector, options) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  let selectorWithSpace = `${selector || ''} `;
  let opts = assign({ last: true, multiple: true }, options);

  if (findElement(pageObjectNode, selectorWithSpace, opts).length) {
    return originalBuildSelector(pageObjectNode, selectorWithSpace, opts);
  }
}

export function buildSelector(pageObjectNode, selector, options) {
  let childSel = childSelector(pageObjectNode, selector, options);

  if (childSel) {
    return childSel;
  } else {
    return originalBuildSelector(pageObjectNode, selector, options);
  }
}
