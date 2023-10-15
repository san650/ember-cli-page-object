import { QuerySelector } from '../selector';
import { importSync } from '@embroider/macros';

let jQuery;

if (window.jQuery) {
  jQuery = window.jQuery;
} else {
  const jqueryImport = importSync('jquery');
  jQuery = jqueryImport.default;
}

// TODO: remove export once we drop findElement methods
export { jQuery as $ };

export default class JQueryQuerySelector extends QuerySelector {
  constructor(selector) {
    if (typeof selector !== 'string') {
      throw new Error('JQueryQuerySelector expects a string as a selector');
    }

    super(selector);
  }

  query(containerElement) {
    const { selector } = this;

    validate(selector);

    // eslint-disable-next-line ember/no-jquery
    return jQuery(selector, containerElement).toArray();
  }

  canConcat(querySelector) {
    return querySelector instanceof JQueryQuerySelector;
  }

  concat(querySelector) {
    return new JQueryQuerySelector(
      `${this.selector} ${querySelector.selector}`
    );
  }
}

function validate(selector) {
  if (selector.indexOf(',') > -1) {
    throw new Error(
      'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
    );
  }
}
