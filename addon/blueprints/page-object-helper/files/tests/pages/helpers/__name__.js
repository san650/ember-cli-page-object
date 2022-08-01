import { findOne } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export default function <%= camelizedModuleName %>(selector, options = {}) {
  return getter(function() {
    return findOne(this, selector, options).disabled;
  });
}
