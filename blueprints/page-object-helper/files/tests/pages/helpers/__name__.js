import Ember from 'ember';
import PageObject from '<%= pageObjectsRoot %>';

function <%= camelizedModuleName %>(selector /*, options */) {
  return Ember.$(selector).prop('checked');
}

export default PageObject.customHelper(<%= camelizedModuleName %>);
