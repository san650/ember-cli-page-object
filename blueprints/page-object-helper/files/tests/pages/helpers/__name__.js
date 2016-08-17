import { findElement } from 'ember-cli-page-object/extend';

export default function <%= camelizedModuleName %>(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findElement(this, selector, options).is(':disabled');
    }
  };
}
