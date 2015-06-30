import Ember from 'ember';
import PageObject from '../../page-object';

let $ = Ember.$;

function <%= camelizeModuleName %>(selector /*, options */) {
  return $(selector).prop('checked');
}

export default PageObject.customHelper(<%= camelizeModuleName %>);
