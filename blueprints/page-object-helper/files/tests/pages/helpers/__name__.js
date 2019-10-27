import { findOne } from 'ember-cli-page-object/extend';

export default function <%= camelizedModuleName %>(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findOne(this, selector, options).disabled;
    }
  };
}
