import Ember from 'ember';
import PageObject from '../../page-object';

function <%= camelizedModuleName %>(selector /*, options */) {
  return Ember.$(selector).prop('checked');
}

export default PageObject.customHelper(<%= camelizedModuleName %>);
